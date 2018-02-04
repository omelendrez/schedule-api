"use strict";
const Employee = require("../models").employee;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    return Employee
      .create({
        badge: req.body.badge,
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        joining_date: req.body.joining_date,
        position_id: req.body.position_id,
        sector_id: req.body.sector_id,
        branch_id: req.body.branch_id,
        exit_date: req.body.exit_date,
        status_id: req.body.status_id
      })
      .then(employee => res.status(201).json(employee))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {
    const Status = require("../models").status;
    const Sector = require("../models").sector;
    const Position = require("../models").position;
    const Branch = require("../models").branch;

    Employee.belongsTo(Status);
    Employee.belongsTo(Sector);
    Employee.belongsTo(Position);
    Employee.belongsTo(Branch);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'badge';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';

    return Employee
      .findAndCountAll({
        where: {
          last_name: {
            $like: '%' + filter + '%'
          },
          first_name: {
            $like: '%' + filter + '%'
          }

        },
        order: [
          [sort, type]
        ],
        offset: size !== 1000 ? (page - 1) * size : 0,
        limit: size,
        include: [
          {
            model: Status,
            where: {
              id: sequelize.col('employee.status_id')
            }
          },
          {
            model: Sector,
            where: {
              id: sequelize.col('employee.sector_id')
            }
          },
          {
            model: Position,
            where: {
              id: sequelize.col('employee.position_id')
            }
          },
          {
            model: Branch,
            where: {
              id: sequelize.col('employee.branch_id')
            }
          }
        ],
      })
      .then(categories => res.json(categories))
      .catch(error => res.status(400).send(error));
  },

  findById(req, res) {
    const Status = require("../models").status;
    const Sector = require("../models").sector;
    const Position = require("../models").position;
    const Branch = require("../models").branch;

    Employee.belongsTo(Status);
    Employee.belongsTo(Sector);
    Employee.belongsTo(Position);
    Employee.belongsTo(Branch);

    return Employee
      .findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Status,
            where: {
              id: sequelize.col('employee.status_id')
            }
          },
          {
            model: Sector,
            where: {
              id: sequelize.col('employee.sector_id')
            }
          },
          {
            model: Position,
            where: {
              id: sequelize.col('employee.position_id')
            }
          },
          {
            model: Branch,
            where: {
              id: sequelize.col('employee.branch_id')
            }
          }
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
      .then(employee => employee.update(
        {
          badge: req.body.badge,
          last_name: req.body.last_name,
          first_name: req.body.first_name,
          joining_date: req.body.joining_date,
          position_id: req.body.position_id,
          sector_id: req.body.sector_id,
          branch_id: req.body.branch_id,
          exit_date: req.body.exit_date,
          status_id: req.body.status_id
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};