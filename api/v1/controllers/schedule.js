"use strict";
const Schedule = require("../models").schedule;
const sequelize = require("sequelize");
const Op = sequelize.Op
const ERROR = 1;
const WARNING = 2
const OK = 0

module.exports = {
  create(req, res) {

    Schedule
      .create({
        budget_id: req.body.budget_id,
        employee_id: req.body.employee_id,
        sector_id: req.body.sector_id,
        position_id: req.body.position_id,
        from: req.body.from,
        to: req.body.to
      })
      .then(schedule => res.status(201).json(schedule))
      .catch(error => res.status(400).send(error));
  },
  verifyInput(req, res) {
    const mysql = require('mysql2');
    const con = mysql.createConnection({
      host: "127.0.0.1",
      user: "escng_schedule",
      password: "M1a4$1t4E8r0",
      database: "escng_schedule"
    });
    con.connect(() => {
      let query = `SELECT id FROM schedule WHERE ((${req.body.from} between schedule.from and schedule.to) or (${req.body.to} between schedule.from+1 and schedule.to)) AND budget_id = ${req.body.budget_id} AND employee_id = ${req.body.employee_id} AND ${req.body.employee_id === 0} LIMIT 1;`
      con.query(query, (err, schedule) => {
        if (schedule.length) {
          res.json({
            error: {
              type: ERROR,
              schedule: schedule,
              message: schedule ? "El empleado está ocupado en ese horario" : ""
            }
          })
        } else {
          let hours = 0
          let query = `SELECT coalesce(sum(schedule.to-schedule.from),0) as hours FROM schedule WHERE id = ${req.body.id} LIMIT 1;`
          con.query(query, (err, schedule) => {
            if (schedule) {
              hours = schedule[0].hours
            }
            let query = `SELECT coalesce(sum(schedule.to-schedule.from),0)+${(parseInt(req.body.to) - parseInt(req.body.from)) - hours} as hours FROM schedule WHERE budget_id = ${req.body.budget_id} AND employee_id = ${req.body.employee_id} LIMIT 1;`
            con.query(query, (err, schedule) => {
              const hours = schedule[0].hours
              if (parseInt(hours) < 4) {
                res.json({
                  error: {
                    type: WARNING,
                    schedule: schedule,
                    message: schedule ? "El empleado tiene menos de 4 horas trabajadas" : ""
                  }
                })
              } else {
                if (parseInt(hours) > 8) {
                  res.json({
                    error: {
                      type: WARNING,
                      schedule: schedule,
                      message: schedule ? "El empleado tiene más de 8 horas trabajadas" : ""
                    }
                  })
                } else {
                  res.json({
                    error: {
                      type: OK,
                      schedule: schedule,
                      message: ""
                    }
                  })
                }
              }
            })
          })
        }
      })
    })
  },
  findById(req, res) {
    const Budget = require("../models").budget;
    const Employee = require("../models").employee;
    const Position = require("../models").position;
    const Sector = require("../models").sector;

    Schedule.belongsTo(Budget);
    Schedule.belongsTo(Employee);
    Schedule.belongsTo(Position);
    Schedule.belongsTo(Sector);

    return Schedule
      .findOne({
        raw: true,
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Budget,
            where: {
              id: sequelize.col('schedule.budget_id')
            },
            attributes: [
              'date',
              [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), '_date'],
              [sequelize.fn('weekday', sequelize.col('date')), 'weekday']
            ]
          },
          {
            model: Employee,
            where: {
              id: sequelize.col('schedule.employee_id')
            },
            attributes: [
              'badge',
              'first_name',
              'last_name'
            ]
          },
          {
            model: Position,
            where: {
              id: sequelize.col('schedule.position_id')
            },
            attributes: [
              'name'
            ]
          },
          {
            model: Sector,
            where: {
              id: sequelize.col('schedule.sector_id')
            },
            attributes: [
              'name'
            ]
          }

        ]

      })
      .then(schedule => schedule ? res.json(schedule) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  findAll(req, res) {
    const Budget = require("../models").budget;
    const Employee = require("../models").employee;
    const Position = require("../models").position;
    const Sector = require("../models").sector;

    Schedule.belongsTo(Budget);
    Schedule.belongsTo(Employee);
    Schedule.belongsTo(Position);
    Schedule.belongsTo(Sector);

    return Schedule
      .findAndCountAll({
        raw: true,
        include: [
          {
            model: Budget,
            where: {
              id: sequelize.col('schedule.budget_id')
            },
            attributes: [
              'date',
              [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), '_date'],
              [sequelize.fn('weekday', sequelize.col('date')), 'weekday']
            ]
          },
          {
            model: Employee,
            where: {
              id: sequelize.col('schedule.employee_id')
            },
            attributes: [
              'badge',
              'first_name',
              'last_name'
            ]
          },
          {
            model: Position,
            where: {
              id: sequelize.col('schedule.position_id')
            },
            attributes: [
              'name'
            ]
          },
          {
            model: Sector,
            where: {
              id: sequelize.col('schedule.sector_id')
            },
            attributes: [
              'name'
            ]
          }

        ]

      })
      .then(schedule => schedule ? res.json(schedule) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
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
    Schedule.belongsTo(Sector);

    Budget.belongsTo(Branch);

    return Budget.findOne({
      raw: true,
      where: {
        date: req.params.date,
        branch_id: req.params.branch_id
      },
      attributes: [
        'id',
        'date',
        [sequelize.fn('weekday', sequelize.col('date')), 'weekday'],
        [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), '_date'],
        'hours',
        'footer',
        'branch_id',
        [sequelize.fn('date_format', sequelize.col('date'), '%d-%m-%Y'), 'date']
      ],
      include: [
        {
          model: Branch,
          where: {
            id: sequelize.col('budget.branch_id')
          },
          attributes: [
            'name'
          ]
        }
      ]
    })
      .then(budget => {
        if (budget) {
          Schedule
            .findAndCountAll({
              raw: true,
              where: {
                budget_id: budget.id
              },
              order: [
                ['employee_id', 'ASC'],
                ['from', 'ASC'],
                ['to', 'ASC'],
              ],
              attributes: [
                'id',
                'from',
                'to',
                'employee_id',
                'sector_id',
                'position_id',
                [sequelize.fn('date_format', sequelize.col('schedule.created_at'), '%d-%b-%y'), 'created_at'],
                [sequelize.fn('date_format', sequelize.col('schedule.updated_at'), '%d-%b-%y'), 'updated_at']
              ],
              include: [
                {
                  model: Employee,
                  where: {
                    id: sequelize.col('schedule.employee_id')
                  },
                  attributes: [
                    'badge',
                    'first_name',
                    'last_name'
                  ]
                },
                {
                  model: Position,
                  where: {
                    id: sequelize.col('schedule.position_id')
                  },
                  attributes: [
                    'name',
                    'color'
                  ]
                },
                {
                  model: Sector,
                  where: {
                    id: sequelize.col('schedule.sector_id')
                  },
                  attributes: [
                    'name'
                  ]
                }
              ]
            })
            .then(schedule => schedule ? res.json({ schedule: schedule, budget: { rows: budget, count: 1 } }) : res.json({ budget: { rows: budget, count: 1 }, schedule: { count: 0, rows: [] } }))
            .catch(error => res.status(400).send(error));
        } else {
          res.json({ budget: { count: 0, rows: [] }, schedule: { count: 0, rows: [] } })
        }
      })
      .catch(error => res.status(400).send(error));

  },
  update(req, res) {
    return Schedule
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(timeoff => timeoff.update(
        {
          budget_id: req.body.budget_id,
          employee_id: req.body.employee_id,
          sector_id: req.body.sector_id,
          position_id: req.body.position_id,
          from: req.body.from,
          to: req.body.to,
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Schedule
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(schedule => schedule.destroy()
        .then(() => {
          res.json({ status: true });
        }))
      .catch(error => res.status(400).send(error));
  }
};