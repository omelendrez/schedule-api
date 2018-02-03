"use strict";
const Timeoff = require("../models").timeoff;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    return Timeoff
      .create({
        name: req.body.name,
        status_id: req.body.status_id
      })
      .then(timeoff => res.status(201).json(timeoff))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {
    const Status = require("../models").status;
    Timeoff.belongsTo(Status);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'name';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';

    return Timeoff
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
            id: sequelize.col('timeoff.status_id')
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
    Timeoff.belongsTo(Status);

    return Timeoff
      .findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: Status,
          where: {
            id: sequelize.col('timeoff.status_id')
          }
        }],
        attributes: [
          'id',
          'name',
          'image',
          'status_id', [sequelize.fn('date_format', sequelize.col('timeoff.created_at'), '%d-%b-%y %H:%i'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('timeoff.updated_at'), '%d-%b-%y %H:%i'), 'updated_at']
        ]
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