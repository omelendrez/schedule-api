"use strict";
const Availability = require("../models").availability;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    const employee_id = req.body.employee_id;
    const mo = req.body.mo;
    const tu = req.body.tu;
    const we = req.body.we;
    const th = req.body.th;
    const fr = req.body.fr;
    const sa = req.body.sa;
    const su = req.body.su;

    return Availability
      .create({
        employee_id: employee_id,
        mo: mo,
        tu: tu,
        we: we,
        th: th,
        fr: fr,
        sa: sa,
        su: su
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
          'mo',
          'tu',
          'we',
          'th',
          'fr',
          'sa',
          'su',
          'employee_id',
          [sequelize.fn('date_format', sequelize.col('availability.created_at'), '%d-%b-%y'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('availability.updated_at'), '%d-%b-%y'), 'updated_at']
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
          mo: req.body.mo,
          tu: req.body.tu,
          we: req.body.we,
          th: req.body.th,
          fr: req.body.fr,
          sa: req.body.sa,
          su: req.body.su
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};