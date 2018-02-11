"use strict";
const Schedule = require("../models").schedule;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    return Schedule
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

    Schedule.belongsTo(Budget);
    Schedule.belongsTo(Employee);
    Schedule.belongsTo(Position);
    Schedule.belongsTo(Sector);

    return Schedule
      .findAndCountAll({
        raw: true,
        order: [
          ['employee_id', 'ASC'],
          ['from', 'ASC'],
        ],
        attributes: [
          'id',
          'from',
          'to',
          'employee_id'
        ],
        include: [
          {
            model: Budget,
            where: {
              id: sequelize.col('schedule.budget_id'),
              date: req.params.date + " 00:00",
              branch_id: req.params.branch_id
            },
            attributes: [
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
      .then(schedule => schedule ? res.json(schedule) : res.status(404).json({
        "error": "Not found"
      }))
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
      .then(Schedule => Schedule.destroy()
        .then(result => {
          res.status(204).json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};