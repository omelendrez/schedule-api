"use strict";
const Branch = require("../models").branch;

module.exports = {

  create(req, res) {
    const name = req.body.name;
    const status_id = req.body.status_id;

    return Branch
      .create({
        name: name,
        status_id: status_id
      })
      .then(branch => res.status(201).json(branch))
      .catch(error => res.status(400).json(error));
  },

  findAll(req, res) {
    return Branch
      .findAll({
        raw: true
      })
      .then(branch => res.json(branch))
      .catch(error => res.status(400).send(error));
  }
};