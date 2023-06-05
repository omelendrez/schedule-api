'use strict'
const Schedule = require('../models').schedule
const sequelize = require('sequelize')
const seq = require('../models/rawQueries')

const errorMessage = [
  {
    key: 'lowRestingTime',
    value:
      'Este empleado ha trabado ayer y le estás dando sólo ({hours}) horas de descanso'
  },
  {
    key: 'mustBeOnTimeoff',
    value: 'Este empleado debería estar de franco en este día'
  },
  {
    key: 'timeFrameBlocked',
    value:
      '{name} tiene bloqueado desde {from} hs. hasta {to} hs. para este día'
  },
  {
    key: 'exceededDailyHours',
    value: 'Le estás asignando más de {hours} horas trabajadas a {name}'
  },
  {
    key: 'exceededMonthlyHours',
    value: '{name} ya ha trabado {hours} horas este mes'
  }
]
const findMessage = (key) => {
  const result = errorMessage.find((item) => {
    return item.key === key
  })
  return result.value
}

module.exports = {
  async create(req, res) {
    const budget_id = req.body.budget_id
    const employee_id = req.body.employee_id
    const from = parseInt(req.body.from)
    const forced = req.body.forced
    let to = parseInt(req.body.to)
    let warnings, data
    to = to < from ? to + 24 : to
    if (!forced) {
      data = await seq.query(
        `call ensure_rest_time(${budget_id},${employee_id},${from});`
      )
      const restTime = data[0].rest_time || 10
      const weekDay = data[0].week_day < 4 ? 9 : 10
      if (restTime < weekDay) {
        warnings = {
          warning: true,
          message: findMessage('lowRestingTime').replace(
            '{hours}',
            data[0].rest_time
          )
        }
        res.json({ warnings })
        return
      }

      data = await seq.query(
        `call check_blocked(${from},${to},${budget_id},${employee_id});`
      )
      if (data.length) {
        warnings = {
          warning: true,
          message: findMessage('timeFrameBlocked')
            .replace('{name}', data[0].first_name)
            .replace('{from}', data[0].from)
            .replace('{to}', data[0].to)
        }
        res.json({ warnings })
        return
      }
      data = await seq.query(
        `call verify_worked_days(${budget_id},${employee_id});`
      )
      if (data.length === 5) {
        warnings = {
          warning: true,
          message: findMessage('mustBeOnTimeoff')
        }
        res.json({ warnings })
        return
      }

      data = await seq.query(
        `call sum_worked_hours(${budget_id},${employee_id});`
      )
      if (data.length && data[0].total > 7) {
        warnings = {
          warning: true,
          message: findMessage('exceededDailyHours')
            .replace('{name}', data[0].name)
            .replace('{hours}', data[0].total)
        }
        res.json({ warnings })
        return
      }

      data = await seq.query(
        `call sum_worked_hours_month(${budget_id},${employee_id});`
      )

      if (data.length && data[0].total > 160) {
        warnings = {
          warning: true,
          message: findMessage('exceededMonthlyHours')
            .replace('{name}', data[0].name)
            .replace('{hours}', data[0].total)
        }
        res.json({ warnings })
        return
      }
    }


    Schedule.findOrCreate({
      where: {
        budget_id: budget_id,
        employee_id: employee_id,
        position_id: req.body.position_id,
        from: from,
        to: to
      }
    })
      .then((schedule) => {
        let warnings = null
        seq
          .query(`call update_total_hours(${budget_id})`)
          .then(() => {
            res.status(201).json({ schedule, warnings })
          })
          .catch((error) => res.status(400).send(error))
      })
      .catch((error) => res.status(400).send(error))

  },
  findByBudget(req, res) {
    const Budget = require('../models').budget
    const Employee = require('../models').employee
    const Position = require('../models').position
    const Sector = require('../models').sector
    const Branch = require('../models').branch

    Schedule.belongsTo(Budget)
    Schedule.belongsTo(Employee)
    Schedule.belongsTo(Position)
    Position.belongsTo(Sector)

    Budget.belongsTo(Branch)

    return Budget.findOne({
      where: {
        date: req.params.date,
        branch_id: req.params.branch_id
      },
      attributes: [
        'id',
        'date',
        [sequelize.fn('weekday', sequelize.col('date')), 'weekday'],
        [sequelize.fn('weekday', sequelize.col('date')), '_weekday'],
        [
          sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'),
          '_date'
        ],
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
          attributes: ['name']
        }
      ]
    })
      .then((budget) => {
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
              'id',
              'from',
              'to',
              'employee_id',
              'position_id'
            ],
            include: [
              {
                model: Employee,
                where: {
                  id: sequelize.col('schedule.employee_id'),
                  status_id: 1
                },
                attributes: ['badge', 'first_name', 'last_name']
              },
              {
                model: Position,
                where: {
                  id: sequelize.col('schedule.position_id')
                },
                attributes: ['name', 'color', 'text'],
                include: [
                  {
                    model: Sector,
                    where: {
                      id: sequelize.col('position.sector_id')
                    },
                    attributes: ['name']
                  }
                ]
              }
            ]
          })
            .then((schedule) =>
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
            .catch((error) => res.status(400).send(error))
        } else {
          res.json({
            budget: { count: 0, rows: [] },
            schedule: { count: 0, rows: [] }
          })
        }
      })
      .catch((error) => res.status(400).send(error))
  },
  findSchedule(req, res) {
    const Budget = require('../models').budget
    const Employee = require('../models').employee
    const Position = require('../models').position
    const Branch = require('../models').branch
    const Availability = require('../models').availability
    const Timeoff = require('../models').timeoff
    const Absenteeism = require('../models').absenteeism

    Employee.hasMany(Schedule)
    Employee.hasMany(Timeoff)
    Timeoff.belongsTo(Absenteeism)
    Employee.hasMany(Availability)
    Schedule.belongsTo(Position)
    Budget.belongsTo(Branch)

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
        [sequelize.fn('weekday', sequelize.col('date')), '_weekday'],
        [
          sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'),
          '_date'
        ],
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
          attributes: ['name']
        }
      ]
    })
      .then((budget) => {
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
            attributes: ['id', 'badge', 'first_name', 'last_name'],
            include: [
              {
                model: Availability,
                where: {
                  employee_id: sequelize.col('employee.id')
                },
                attributes: ['week_day', 'from', 'to'],
                required: false
              },
              {
                model: Timeoff,
                where: {
                  employee_id: sequelize.col('employee.id'),
                  date: budget._date
                },
                attributes: ['absenteeism_id'],
                required: false,
                include: {
                  model: Absenteeism,
                  where: {
                    id: sequelize.col('absenteeism_id')
                  },
                  attributes: ['name']
                }
              },
              {
                model: Schedule,
                where: {
                  employee_id: sequelize.col('employee.id'),
                  budget_id: budget.id
                },
                attributes: ['id', 'budget_id', 'from', 'to', 'position_id'],
                order: ['from', 'to'],
                required: false,
                include: [
                  {
                    model: Position,
                    where: {
                      id: sequelize.col('schedules.position_id')
                    },
                    attributes: ['name', 'color', 'text']
                  }
                ]
              }
            ]
          })
            .then((schedule) =>
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
            .catch((error) => res.status(400).send(error))
        } else {
          res.json({
            budget: { count: 0, rows: [] },
            schedule: { count: 0, rows: [] }
          })
        }
      })
      .catch((error) => res.status(400).send(error))
  },
  update(req, res) {
    const from = parseInt(req.body.from)
    let to = parseInt(req.body.to)
    to = to < from ? to + 24 : to
    return Schedule.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((schedule) =>
        schedule
          .update({
            budget_id: req.body.budget_id,
            employee_id: req.body.employee_id,
            position_id: req.body.position_id,
            from: from,
            to: to
          })
          .then((result) => {
            const query = `call update_total_hours(${req.body.budget_id})`
            seq.query(query)
            res.json(result)
          })
      )
      .catch((error) => res.status(400).send(error))
  },
  delete(req, res) {
    return Schedule.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((schedule) => {
        const budget_id = schedule.budget_id
        schedule.destroy().then(() => {
          const query = `call update_total_hours(${budget_id})`
          seq.query(query)
          res.json({ status: true })
        })
      })
      .catch((error) => res.status(400).send(error))
  },
  findTimeoff(req, res) {
    const query = `call get_presence(${req.params.budget_id})`
    seq.query(query).then((timeoff) => {
      if (timeoff) {
        res.json(timeoff)
      } else {
        res.json([])
      }
    })
  },

  async getConsumedBySectorReport(req, res) {
    const query = require('./../utils/query.json').consumedBySectorReport

    const all = await seq.query(
      query.all
        .replace('{{dateFrom}}', req.params.date_from)
        .replace('{{dateTo}}', req.params.date_to)
        .replace('{{branchId}}', req.params.branch_id)
    )

    const sector = await seq.query(
      query.sector
        .replace('{{dateFrom}}', req.params.date_from)
        .replace('{{dateTo}}', req.params.date_to)
        .replace('{{branchId}}', req.params.branch_id)
    )

    res.json({ sector: sector[0], all: all[0] })
  },

  async getBudgetVsConsumed(req, res) {
    const query = require('./../utils/query.json').budgetVsConsumed

    const budgetMonthly = await seq.query(query.budgetMonthly)
    const actualMonthly = await seq.query(query.actualMonthly)

    const budgetDaily = await seq.query(query.budgetDaily)
    const actualDaily = await seq.query(query.actualDaily)

    res.json({
      monthly: { actual: actualMonthly[0], budget: budgetMonthly[0] },
      daily: { actual: actualDaily[0], budget: budgetDaily[0] }
    })
  }
}
