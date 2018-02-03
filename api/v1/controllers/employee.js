"use strict";
const Employee = require("../models").employee;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    return Employee
      .create({
        name: req.body.name,
        status_id: req.body.status_id
      })
      .then(employee => res.status(201).json(employee))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {
    const Status = require("../models").status;
    Employee.belongsTo(Status);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'name';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';

    return Employee
      .findAndCountAll({
        where: {
          name: {
            $like: '%' + filter + '%'
          }
        },
        order: [
          [sort, type]
        ],
        offset: size !== 1000 ? (page - 1) * size : 0,
        limit: size,
        include: [{
          model: Status,
          where: {
            id: sequelize.col('employee.status_id')
          }
        }],
        attributes: [
          'id',
          'name',
          'image'
        ]
      })
      .then(categories => res.json(categories))
      .catch(error => res.status(400).send(error));
  },

  findById(req, res) {
    const Status = require("../models").status;
    Employee.belongsTo(Status);

    return Employee
      .findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: Status,
          where: {
            id: sequelize.col('employee.status_id')
          }
        }],
        attributes: [
          'id',
          'name',
          'image',
          'status_id', [sequelize.fn('date_format', sequelize.col('employee.created_at'), '%d-%b-%y %H:%i'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('employee.updated_at'), '%d-%b-%y %H:%i'), 'updated_at']
        ]
      })
      .then(employee => employee ? res.json(employee) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return Employee
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(employee => employee.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Employee
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(employee => employee.update({
          name: req.body.name,
          status_id: req.body.status_id
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};