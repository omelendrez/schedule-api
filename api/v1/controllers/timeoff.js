"use strict";
const Timeoff = require("../models").timeoff;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    return Timeoff.create({
      employee_id: req.body.employee_id,
      date: req.body.date
    })
      .then(timeoff => res.status(201).json(timeoff))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {
    const Employee = require("../models").employee;
    Timeoff.belongsTo(Employee);

    return Timeoff.findAndCountAll({
      raw: true,
      include: [
        {
          model: Employee,
          where: {
            id: sequelize.col("timeoff.employee_id")
          },
          attributes: ["first_name", "last_name"]
        }
      ],
      sort: ["date", "DESC"],
      attributes: [
        "id",
        "employee_id",
        [
          sequelize.fn(
            "date_format",
            sequelize.col("timeoff.date"),
            "%d-%b-%y"
          ),
          "date"
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("timeoff.date"),
            "%Y-%m-%d"
          ),
          "_date"
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("timeoff.created_at"),
            "%d-%b-%y"
          ),
          "created_at"
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("timeoff.updated_at"),
            "%d-%b-%y"
          ),
          "updated_at"
        ]
      ]
    })
      .then(timeoff => res.json(timeoff))
      .catch(error => res.status(400).send(error));
  },

  findByEmployeeId(req, res) {
    return Timeoff.findAndCountAll({
      where: {
        employee_id: req.params.id
      }
    })
      .then(
        timeoff =>
          timeoff
            ? res.json(timeoff)
            : res.status(404).json({
                error: "Not found"
              })
      )
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Timeoff.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(timeoff =>
        timeoff.destroy().then(result => {
          res.json(result);
        })
      )
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return Timeoff.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(timeoff =>
        timeoff
          .update({
            employee_id: req.body.employee_id,
            date: req.body.date
          })
          .then(result => {
            res.json(result);
          })
      )
      .catch(error => res.status(400).send(error));
  }
};
