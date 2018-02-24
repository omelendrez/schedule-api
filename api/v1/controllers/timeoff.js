"use strict";
const Timeoff = require("../models").timeoff;

module.exports = {
  create(req, res) {
    return Timeoff
      .create({
        employee_id: req.body.employee_id,
        date: req.body.date
      })
      .then(timeoff => res.status(201).json(timeoff))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {
    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'date';
    const type = req.query.type ? req.query.type : 'asc';

    return Timeoff
      .findAndCountAll({
        order: [
          [sort, type]
        ],
        offset: size !== 1000 ? (page - 1) * size : 0,
        limit: size,
      })
      .then(timeoff => res.json(timeoff))
      .catch(error => res.status(400).send(error));
  },

  findById(req, res) {
    return Timeoff
      .findOne({
        where: {
          id: req.params.id
        },
      })
      .then(timeoff => timeoff ? res.json(timeoff) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  findByEmployeeId(req, res) {
    return Timeoff
      .findAndCountAll({
        where: {
          employee_id: req.params.id
        },
      })
      .then(timeoff => timeoff ? res.json(timeoff) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Timeoff
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(timeoff => timeoff.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Timeoff
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(timeoff => timeoff.update({
        name: req.body.name,
        status_id: req.body.status_id
      })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};