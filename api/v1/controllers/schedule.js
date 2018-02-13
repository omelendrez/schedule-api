"use strict";
const Schedule = require("../models").schedule;
const sequelize = require("sequelize");
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
    Schedule
      .findOne({
        where: {
          budget_id: req.body.budget_id,
          employee_id: req.body.employee_id,
          sector_id: req.body.sector_id,
          position_id: req.body.position_id
        }
      })
      .then((schedule) => {
        res.json({
          error: {
            type: schedule && !req.body.id ? ERROR : 0,
            schedule: schedule,
            message: "Esta información ya existe en la base de datos"
          }
        })
      })
      .catch(error => res.status(400).send(error));
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
              'date'
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
              'date'
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
        date: req.params.date + " 00:00",
        branch_id: req.params.branch_id
      },
      attributes: [
        'id',
        'date',
        'hours',
        'footer',
        'branch_id',
        [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), 'date']
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
              ],
              attributes: [
                'id',
                'from',
                'to',
                'employee_id',
                'sector_id',
                'position_id',
                [sequelize.fn('date_format', sequelize.col('sector.created_at'), '%d-%b-%y'), 'created_at'],
                [sequelize.fn('date_format', sequelize.col('sector.updated_at'), '%d-%b-%y'), 'updated_at']
              ],
              include: [
                {
                  model: Employee,
                  where: {
                    id: sequelize.col('schedule.employee_id')
                  },
                  attributes: [
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