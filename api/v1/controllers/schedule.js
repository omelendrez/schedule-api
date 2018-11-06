"use strict";
const Schedule = require("../models").schedule;
const sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.json"))[
  env
];
const seq = new sequelize(config.database, config.username, config.password, config);
const errorMessage = [
  {
    key: "lowRestingTime",
    value: "Este empleado ha trabado ayer y le estás dando sólo ({hours}) horas de descanso"
  },
  {
    key: "mustBeOnTimeoff",
    value: "Este empleado debería estar de franco en este día"
  }
];
const findMessage = key => {
  const result = errorMessage.find(item => {
    return item.key === key;
  });
  return result.value;
};

module.exports = {
  create (req, res) {
    const budget_id = req.body.budget_id
    const employee_id = req.body.employee_id
    const from = parseInt(req.body.from)
    const forced = req.body.forced
    let to = parseInt(req.body.to)
    to = to < from ? to + 24 : to

    let query = `call ensure_rest_time(${budget_id},${employee_id},${from});`
    seq.query(query)
      .then(data => {
        const restedHours = data[0].rest_time || 10
        const allowedRestHours = (data[0].week_day < 4) ? 9 : 10

        if (restedHours < allowedRestHours && !forced) {
          const warnings = {
            warning: true,
            message: findMessage("lowRestingTime").replace('{hours}', data[0].rest_time)
          }
          res.json({ warnings });
        } else {
          Schedule.create({
            budget_id: budget_id,
            employee_id: employee_id,
            position_id: req.body.position_id,
            from: from,
            to: to
          })
            .then(schedule => {
              let warnings = null
              query = `call update_total_hours(${req.body.budget_id})`
              seq.query(query)
                .then(() => {
                  query = `call verify_worked_days(${budget_id},${employee_id});`
                  seq.query(query)
                    .then(worked_time => {
                      if (worked_time.length === 6 && !forced) {
                        warnings = {
                          warning: true,
                          message: findMessage("mustBeOnTimeoff")
                        }
                      }
                      res.status(201).json({ schedule, warnings });
                    })
                })
            })
            .catch(error => res.status(400).send(error));
        }
      })
  },
  findByBudget (req, res) {
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
            where: {
              budget_id: budget.id
            },
            order: [
              [Employee, 'last_name', 'ASC'],
              [Employee, 'first_name', 'ASC'],
              ['from', 'ASC'],
              [Position, 'sector_id', 'ASC'],
              [Position, 'name', 'ASC']
            ],
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
                  id: sequelize.col("schedule.employee_id"),
                  status_id: 1
                },
                attributes: ["badge", "first_name", "last_name"]
              },
              {
                model: Position,
                where: {
                  id: sequelize.col("schedule.position_id")
                },
                attributes: ["name", "color", "text"],
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
  findSchedule (req, res) {
    const Budget = require("../models").budget;
    const Employee = require("../models").employee;
    const Position = require("../models").position;
    const Branch = require("../models").branch;
    const Availability = require("../models").availability;
    const Timeoff = require("../models").timeoff;
    const Absenteeism = require("../models").absenteeism

    Employee.hasMany(Schedule)
    Employee.hasMany(Timeoff)
    Timeoff.belongsTo(Absenteeism)
    Employee.hasMany(Availability)
    Schedule.belongsTo(Position);
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
          Employee.findAndCountAll({
            where: {
              branch_id: budget.branch_id,
              status_id: 1
            },
            order: [
              ['last_name', 'ASC'],
              ['first_name', 'ASC']
            ],
            attributes: ["id", "badge", "first_name", "last_name"],
            include: [
              {
                model: Availability,
                where: {
                  employee_id: sequelize.col("employee.id")
                },
                attributes: [
                  "week_day",
                  "from",
                  "to"
                ],
                required: false
              },
              {
                model: Timeoff,
                where: {
                  employee_id: sequelize.col("employee.id"),
                  date: budget._date
                },
                attributes: ["absenteeism_id"],
                required: false,
                include: {
                  model: Absenteeism,
                  where: {
                    id: sequelize.col("absenteeism_id")
                  },
                  attributes: ["name"]
                }
              },
              {
                model: Schedule,
                where: {
                  employee_id: sequelize.col("employee.id"),
                  budget_id: budget.id
                },
                attributes: [
                  "id",
                  "budget_id",
                  "from",
                  "to",
                  "position_id"
                ],
                order: [
                  "from",
                  "to"
                ],
                required: false,
                include: [
                  {
                    model: Position,
                    where: {
                      id: sequelize.col("schedules.position_id")
                    },
                    attributes: ["name", "color", "text"]
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
  update (req, res) {
    const from = parseInt(req.body.from)
    let to = parseInt(req.body.to)
    to = to < from ? to + 24 : to
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
            from: from,
            to: to
          })
          .then(result => {
            const query = `call update_total_hours(${req.body.budget_id})`
            seq.query(query)
            res.json(result);
          })
      )
      .catch(error => res.status(400).send(error));
  },
  delete (req, res) {
    return Schedule.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(schedule => {
        const budget_id = schedule.budget_id
        schedule.destroy().then(() => {
          const query = `call update_total_hours(${budget_id})`
          seq.query(query)
          res.json({ status: true });
        })
      }
      )
      .catch(error => res.status(400).send(error));
  },
  findTimeoff (req, res) {
    const query = `call get_presence(${req.params.budget_id})`
    seq.query(query)
      .then(timeoff => {
        if (timeoff) {
          res.json(timeoff);
        } else {
          res.json([]);
        }
      })
  },

  getConsumedBySectorReport (req, res) {
    const query = `select se.name as sector, p.name as position, sum(total) as total from schedule as s
    inner join budget as b on s.budget_id = b.id
    inner join position as p on s.position_id = p.id
    inner join sector as se on p.sector_id = se.id
    where b.date between '${req.params.date_from}' and '${req.params.date_to}'
    group by se.name, p.name;`
    seq.query(query)
      .then(result => {
        const all = result[0]
        const query = `select se.name as sector, sum(total) as total from schedule as s
        inner join budget as b on s.budget_id = b.id
        inner join position as p on s.position_id = p.id
        inner join sector as se on p.sector_id = se.id
        where b.date between '${req.params.date_from}' and '${req.params.date_to}'
        group by se.name;`
        seq.query(query)
          .then(result => {
            const sector = result[0]
            res.json({ sector: sector, all: all })
          })
          .catch(error => res.status(400).send(error))
      })
      .catch(error => res.status(400).send(error))
  },

  getBudgetVsConsumed (req, res) {
    const query = `select year(b.date) as year, DATE_FORMAT(b.date, '%m-%Y') as month, sum(b.hours) as hours
    from budget as b
    where datediff(now(), b.date) < 180
    group by year(b.date), DATE_FORMAT(b.date, '%m-%Y'), month(b.date);`
    seq.query(query)
      .then(result => {
        const budget = result[0]
        const query = `select year(b.date) as year, DATE_FORMAT(b.date, '%m-%Y')  as month, sum(s.total) as total
        from budget as b
        inner join schedule as s on s.budget_id = b.id
        where datediff(now(), b.date) < 180
        group by year(b.date), DATE_FORMAT(b.date, '%m-%Y');`
        seq.query(query)
          .then(result => {
            const actual = result[0]
            res.json({ actual: actual, budget: budget })
          })
          .catch(error => res.status(400).send(error))
      })
      .catch(error => res.status(400).send(error))
  }
};
