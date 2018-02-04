"use strict";
const Schedule = require("../models").schedule;

module.exports = {
  create(req, res) {
    return Schedule
      .create({
        budget_id: req.body.budget_id,
        employee_id: req.body.employee_id,
        position: req.body.position,
        from: req.body.from,
        to: req.body.to
      })
      .then(schedule => res.status(201).json(schedule))
      .catch(error => res.status(400).send(error));
  },
  findById(req, res) {

    return Schedule
      .findOne({
        where: {
          id: req.params.id
        },
      })
      .then(schedule => schedule ? res.json(schedule) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  findByBudgetId(req, res) {

    return Schedule
      .findOne({
        where: {
          budget_id: req.params.id
        },
      })
      .then(schedule => schedule ? res.json(schedule) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return Schedule
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(timeoff => timeoff.update(
        {
          budget_id: req.body.budget_id,
          employee_id: req.body.employee_id,
          position: req.body.position,
          from: req.body.from,
          to: req.body.to,
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Schedule
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(Schedule => Schedule.destroy()
        .then(result => {
          res.status(204).json(result);
        }))
      .catch(error => res.status(400).send(error));
  }
};