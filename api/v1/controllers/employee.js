"use strict";
const Employee = require("../models").employee;
const EmployeePosition = require("../models").employee_position;
const Availability = require("../models").availability;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    Employee
      .create({
        badge: req.body.badge,
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        joining_date: req.body.joining_date,
        branch_id: req.body.branch_id,
        status_id: 1
      })
      .then(employee => {
        const pos = req.body.selectedPositions
        let data = []
        for (let i = 0; i < pos.length; i++) {
          let record = {}
          record.employee_id = employee.id
          record.position_id = pos[i]
          data.push(record)
        }
        EmployeePosition
          .bulkCreate(data)
          .then(() => {
            const _body = req.body
            data = []
            for (var prop in _body) {
              if (_body.hasOwnProperty(prop)) {
                if (prop.substring(0, 3) === "fld" && prop.indexOf("from") > 0) {
                  const fld = prop.split("_")
                  let record = {}
                  record.employee_id = employee.id
                  record.week_day = fld[1]
                  record[fld[2]] = req.body[prop];
                  record.to = req.body["fld_" + fld[1] + "_to"];
                  data.push(record)
                }
              }
            }
            Availability
              .bulkCreate(data)
              .then(() => {
                res.status(201).json(employee)
              })
          })
      })
      .catch(error => res.status(400).send(error));

  },

  findAll(req, res) {
    const Status = require("../models").status;
    const Branch = require("../models").branch;

    Employee.belongsTo(Status);
    Employee.belongsTo(Branch);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'badge';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';

    return Employee
      .findAndCountAll({
        raw: true,
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
            },
            attributes: [
              'name'
            ]
          },
          {
            model: Branch,
            where: {
              id: sequelize.col('employee.branch_id')
            },
            attributes: [
              'name'
            ]
          }

        ],
        attributes: [
          'id',
          'badge',
          'last_name',
          'first_name',
          'badge',
          'status_id',
          'branch_id',
          [sequelize.fn('date_format', sequelize.col('employee.joining_date'), '%Y-%m-%d'), 'joining_date'],
          [sequelize.fn('date_format', sequelize.col('employee.joining_date'), '%d-%b-%y'), '_joining_date'],
          [sequelize.fn('date_format', sequelize.col('employee.created_at'), '%d-%b-%y'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('employee.updated_at'), '%d-%b-%y'), 'updated_at']
        ]
      })
      .then(categories => res.json(categories))
      .catch(error => res.status(400).send(error));
  },

  findById(req, res) {
    const Status = require("../models").status;
    const Branch = require("../models").branch;
    const Availability = require("../models").availability;
    const EmployeePosition = require("../models").employee_position;

    Employee.belongsTo(Status);
    Employee.belongsTo(Branch);
    Employee.hasMany(Availability);
    Employee.hasMany(EmployeePosition);

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
            },
            attributes: [
              'name'
            ]
          },
          {
            model: Branch,
            where: {
              id: sequelize.col('employee.branch_id')
            },
            attributes: [
              'name'
            ]
          },
          {
            model: Availability,
            where: {
              id: sequelize.col('employee.id')
            },
            attributes: [
              'week_day',
              'from',
              'to'
            ]
          },
          {
            model: EmployeePosition,
            where: {
              id: sequelize.col('employee.id')
            },
            attributes: [
              'position_id'
            ]
          }
        ]
      })
      .then(employee => employee ? res.json(employee) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  findByBranchId(req, res) {
    return Employee
      .findAndCountAll({
        raw: true,
        where: {
          branch_id: req.params.id,
          status_id: 1
        },
        attributes: [
          'id',
          'badge',
          'first_name',
          'last_name',
          'sector_id'
        ],
        order: ['badge']
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
      .then(employee => employee.update(
        {
          status_id: employee.status_id === 1 ? 2 : 1
        }
      )
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
          branch_id: req.body.branch_id
        })
        .then(result => {
          const employeeId = req.params.id
          EmployeePosition.destroy({
            where: {
              employee_id: employeeId
            }
          })
            .then(() => {
              const pos = req.body.selectedPositions
              let data = []
              for (let i = 0; i < pos.length; i++) {
                let record = {}
                record.employee_id = employee.id
                record.position_id = pos[i]
                data.push(record)
              }
              EmployeePosition
                .bulkCreate(data)
                .then(() => {
                  Availability.destroy({
                    where: {
                      employee_id: employee.id
                    }
                  })
                    .then(() => {
                      const _body = req.body
                      data = []
                      for (var prop in _body) {
                        if (_body.hasOwnProperty(prop)) {
                          if (prop.substring(0, 3) === "fld" && prop.indexOf("from") > 0) {
                            const fld = prop.split("_")
                            let record = {}
                            record.employee_id = employee.id
                            record.week_day = fld[1]
                            record[fld[2]] = req.body[prop];
                            record.to = req.body["fld_" + fld[1] + "_to"];
                            data.push(record)
                          }
                        }
                      }
                      Availability
                        .bulkCreate(data)
                        .then(() => {
                          res.status(201).json(result)
                        })
                    })
                })

            })
            .catch(error => res.status(400).send(error));
        }))
  }
}