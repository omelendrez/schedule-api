"use strict";
const Availability = require("../models").availability;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    const employee_id = req.body.employee_id;
    const week_day = req.body.week_day;
    const from = req.body.from;
    const to = req.body.to;
    return Availability
      .create({
        employee_id: employee_id,
        week_day: week_day,
        from: from,
        to: to
      })
      .then(availability => res.status(201).json(availability))
      .catch(error => res.status(400).json(error));
  },
  findAll(req, res) {
    const Employees = require("../models").employee;
    Availability.belongsTo(Employees);

    return Availability
      .findAndCountAll({
        raw: true,
        include: [{
          model: Employees,
          where: {
            id: sequelize.col('availability.employee_id'),
            status_id: 1
          },
          attributes: [
            'badge',
            'first_name',
            'last_name'
          ]
        }],
        attributes: [
          'id',
          'employee_id',
          'week_day'
        ]
      })
      .then(branch => res.json(branch))
      .catch(error => res.status(400).send(error));
  },
  findById(req, res) {

    return Availability
      .findOne({
        where: {
          id: req.params.id
        },
      })
      .then(availability => availability ? res.json(availability) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  findByEmployeeId(req, res) {

    return Availability
      .findAndCountAll({
        where: {
          employee_id: req.params.id
        },
      })
      .then(availability => availability ? res.json(availability) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Availability
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(branch => branch.update(
        {
          employee_id: req.body.employee_id,
          week_day: req.body.week_day,
          from: req.body.from,
          to: req.body.to
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};
