"use strict";
const Schedule = require("../models").schedule;
const sequelize = require("sequelize");

const ERROR = 1;
const WARNING = 2;
const OK = 0;

module.exports = {
  create(req, res) {
    Schedule.create({
      budget_id: req.body.budget_id,
      employee_id: req.body.employee_id,
      position_id: req.body.position_id,
      from: req.body.from,
      to: req.body.to
    })
      .then(schedule => res.status(201).json(schedule))
      .catch(error => res.status(400).send(error));
  },
  verifyInput(req, res) {
    const mysql = require("mysql2");
    const path = require("path");
    const env = process.env.NODE_ENV || "development";
    const config = require(path.join(__dirname, "..", "config", "config.json"))[
      env
    ];

    const con = mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
      database: config.database
    });
    con.connect(() => {
      let query = `call check_overwrite(${req.body.id},${req.body.from},${req.body.to},${req.body.budget_id}, ${req.body.employee_id})`
      con.query(query, (err, schedule) => {
        if (schedule[0][0]) {
          res.json({
            error: {
              type: ERROR,
              schedule: schedule,
              message: schedule ? `${schedule[0][0].first_name} ya está asignado para este día de ${schedule[0][0].from}hs. a ${schedule[0][0].to}hs.` : ""
            }
          });
        } else {
          let hours = 0;
          let query = `SELECT coalesce(sum(schedule.to-schedule.from),0) as hours FROM schedule WHERE id = ${req.body.id} LIMIT 1;`;
          con.query(query, (err, schedule) => {
            if (schedule) {
              hours = schedule[0].hours;
            }
            let query = `SELECT coalesce(sum(schedule.to-schedule.from),0)+${parseInt(
              req.body.to
            ) -
              parseInt(req.body.from) -
              hours} as hours FROM schedule WHERE budget_id = ${
              req.body.budget_id
              } AND employee_id = ${req.body.employee_id} LIMIT 1;`;
            con.query(query, (err, schedule) => {
              const hours = schedule[0].hours;
              if (parseInt(hours) < 4) {
                res.json({
                  error: {
                    type: WARNING,
                    schedule: schedule,
                    message: schedule
                      ? `El empleado tiene menos de 4 horas trabajadas (${hours} horas)`
                      : ""
                  }
                });
              } else {
                if (parseInt(hours) > 8) {
                  res.json({
                    error: {
                      type: WARNING,
                      schedule: schedule,
                      message: schedule
                        ? `El empleado tiene más de 8 horas trabajadas en el día (${hours} horas)`
                        : ""
                    }
                  });
                } else {
                  let query = `call check_blocked(${req.body.from},${req.body.to},${req.body.budget_id}, ${req.body.employee_id})`
                  con.query(query, (err, schedule) => {
                    if (schedule[0][0]) {
                      res.json({
                        error: {
                          type: WARNING,
                          schedule: schedule,
                          message: schedule ? `${schedule[0][0].first_name} tiene bloqueado de ${schedule[0][0].from}hs. a ${schedule[0][0].to}hs. para este día de la semana` : ""
                        }
                      });
                    } else {

                      let query = `call get_presence(${req.body.budget_id}, ${req.body.employee_id})`
                      con.query(query, (err, schedule) => {
                        if (schedule[0][0].presence > 5) {
                          res.json({
                            error: {
                              type: WARNING,
                              schedule: schedule,
                              message: schedule ? `El empleado ha completado los últimos 6 días de trabajo consecutivos y tiene derecho a un día de franco` : ""
                            }
                          });
                        } else {

                          res.json({
                            error: {
                              type: OK,
                              schedule: schedule,
                              message: ""
                            }
                          });
                        }
                      })

                    }
                  })
                }
              }
            });
          });
        }
      });
    });
  },
  findByBudget(req, res) {
    const Budget = require("../models").budget;
    const Employee = require("../models").employee;
    const Position = require("../models").position;
    const Sector = require("../models").sector;
    const Branch = require("../models").branch;

    Schedule.belongsTo(Budget);
    Schedule.belongsTo(Employee);
    Schedule.belongsTo(Position);
    Position.belongsTo(Sector);

    Budget.belongsTo(Branch);

    return Budget.findOne({
      raw: true,
      where: {
        date: req.params.date,
        branch_id: req.params.branch_id
      },
      attributes: [
        "id",
        "date",
        [sequelize.fn("weekday", sequelize.col("date")), "weekday"],
        [sequelize.fn("weekday", sequelize.col("date")), "_weekday"],
        [
          sequelize.fn("date_format", sequelize.col("date"), "%Y-%m-%d"),
          "_date"
        ],
        "hours",
        "footer",
        "branch_id",
        [sequelize.fn("date_format", sequelize.col("date"), "%d-%m-%Y"), "date"]
      ],
      include: [
        {
          model: Branch,
          where: {
            id: sequelize.col("budget.branch_id")
          },
          attributes: ["name"]
        }
      ]
    })
      .then(budget => {
        if (budget) {
          Schedule.findAndCountAll({
            raw: true,
            where: {
              budget_id: budget.id
            },
            order: [["employee_id", "ASC"], ["from", "ASC"], ["to", "ASC"]],
            attributes: [
              "id",
              "from",
              "to",
              "employee_id",
              "position_id",
              [
                sequelize.fn(
                  "date_format",
                  sequelize.col("schedule.created_at"),
                  "%d-%b-%y"
                ),
                "created_at"
              ],
              [
                sequelize.fn(
                  "date_format",
                  sequelize.col("schedule.updated_at"),
                  "%d-%b-%y"
                ),
                "updated_at"
              ]
            ],
            include: [
              {
                model: Employee,
                where: {
                  id: sequelize.col("schedule.employee_id")
                },
                attributes: ["badge", "first_name", "last_name"]
              },
              {
                model: Position,
                where: {
                  id: sequelize.col("schedule.position_id")
                },
                attributes: ["name", "color"],
                include: [
                  {
                    model: Sector,
                    where: {
                      id: sequelize.col("position.sector_id")
                    },
                    attributes: ["name"]
                  }
                ]
              }
            ]
          })
            .then(
              schedule =>
                schedule
                  ? res.json({
                    schedule: schedule,
                    budget: { rows: budget, count: 1 }
                  })
                  : res.json({
                    budget: { rows: budget, count: 1 },
                    schedule: { count: 0, rows: [] }
                  })
            )
            .catch(error => res.status(400).send(error));
        } else {
          res.json({
            budget: { count: 0, rows: [] },
            schedule: { count: 0, rows: [] }
          });
        }
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return Schedule.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(schedule =>
        schedule
          .update({
            budget_id: req.body.budget_id,
            employee_id: req.body.employee_id,
            position_id: req.body.position_id,
            from: req.body.from,
            to: req.body.to
          })
          .then(result => {
            res.json(result);
          })
      )
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Schedule.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(schedule =>
        schedule.destroy().then(() => {
          res.json({ status: true });
        })
      )
      .catch(error => res.status(400).send(error));
  }
};
