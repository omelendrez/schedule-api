"use strict";
const Budget = require("../models").budget;

module.exports = {

  create(req, res) {
    const branch_id = req.body.branch_id;
    const date = req.body.date;
    const hours = req.body.hours;

    return Budget
      .create({
        branch_id: branch_id,
        date: date,
        hours: hours
      })
      .then(budget => res.status(201).json(budget))
      .catch(error => res.status(400).json(error));
  },

  findAll(req, res) {
    return Budget
      .findAndCountAll({
        raw: true
      })
      .then(budget => res.json(budget))
      .catch(error => res.status(400).send(error));
  }
};