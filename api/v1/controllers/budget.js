"use strict";
const Budget = require("../models").budget;
const sequelize = require("sequelize");

module.exports = {

  create(req, res) {
    return Budget
      .create({
        branch_id: req.body.branch_id,
        date: req.body.date + " 00:00:00",
        hours: req.body.hours,
        footer: req.body.footer
      })
      .then(budget => res.status(201).json(budget))
      .catch(error => res.status(400).json(error));
  },

  findAll(req, res) {
    const Branch = require("../models").branch;
    Budget.belongsTo(Branch);

    return Budget
      .findAndCountAll({
        raw: true,
        attributes: [
          'id',
          'branch_id',
          [sequelize.fn('date_format', sequelize.col('date'), '%d-%m-%y'), 'date'],
          [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), '_date'],
          'hours',
          'footer',
          [sequelize.fn('date_format', sequelize.col('budget.created_at'), '%d-%b-%y'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('budget.updated_at'), '%d-%b-%y'), 'updated_at']
        ],
        include: [{
          model: Branch,
          where: {
            id: sequelize.col('budget.branch_id')
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
  update(req, res) {
    return Budget
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(budget => budget.update(
        {
          branch_id: req.body.branch_id,
          date: req.body.date + " 00:00:00",
          hours: req.body.hours,
          footer: req.body.footer
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return Budget
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(budget => budget.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

};