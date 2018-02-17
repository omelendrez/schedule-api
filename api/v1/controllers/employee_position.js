"use strict";
const EmployeePosition = require("../models").employee_position;
const sequelize = require("sequelize");


module.exports = {
  create(req, res) {
    return EmployeePosition
      .create({
        employee_id: req.body.employee_id,
        sector_id: req.body.sector_id,
        position_id: req.body.position_id
      })
      .then(employee => res.status(201).json(employee))
      .catch(error => res.status(400).send(error));
  },

  findByEmployeeId(req, res) {
    const Sector = require("../models").sector;
    const Position = require("../models").position;
    EmployeePosition.belongsTo(Sector);
    EmployeePosition.belongsTo(Position);

    return EmployeePosition
      .findAndCountAll({
        raw: true,
        where: {
          employee_id: req.query.employee_id
        },
        attributes: [
          'id',
          'employee_id',
          'sector_id',
          'position_id'
        ],
        include: [{
          model: Sector,
          where: {
            id: sequelize.col('employee_position.sector_id')
          },
          attributes: [
            'name'
          ]
        },
        {
          model: Position,
          where: {
            id: sequelize.col('employee_position.position_id')
          },
          attributes: [
            'name'
          ]
        }],
        order: [
          ['date', 'desc']
        ],
      })
      .then(budget => res.json(budget))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    EmployeePosition
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(employeePosition => employeePosition.update(
        {
          active: req.body.active
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};