"use strict";
const Schedule = require("../models").schedule;
var sequelize = require('sequelize');


module.exports = {

  create(req, res) {
    return Schedule
      .create({
        product_id: req.body.product_id,
        discount_id: req.body.discount_id
      })
      .then(productDiscount => res.status(201).json(productDiscount))
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Schedule
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(productDiscount => productDiscount.destroy()
        .then(result => {
          res.status(204).json(result);
        }))
      .catch(error => res.status(400).send(error));
  }

};