"use strict";
const EmployeePosition = require("../models").employee_position;
const sequelize = require("sequelize");


module.exports = {
  create(req, res) {
    return EmployeePosition
      .create({
        employee_id: req.body.employee_id,
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

  findByPositionId(req, res) {
    const Employee = require("../models").employee;
    EmployeePosition.belongsTo(Employee)

    return EmployeePosition
      .findAndCountAll({
        raw: true,
        where: {
          position_id: req.params.id
        },
        attributes: [],
        include: {
          model: Employee,
          where: {
            id: sequelize.col('employee_position.employee_id'),
            status_id: 1
          },
          attributes: [
            'id',
            'badge',
            'last_name',
            'first_name',
            'branch_id'
          ]

        }
      })
      .then(employeePosition => res.json(employeePosition))
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    EmployeePosition
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(employeePosition => employeePosition.destroy()
        .then(() => {
          res.json({ success: true });
        }))
      .catch(error => res.status(400).send(error));
  }
};
