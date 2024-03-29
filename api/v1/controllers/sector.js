"use strict";
const sector = require("../models").sector;
const sequelize = require("sequelize");

module.exports = {
  create(req, res) {
    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    return sector
      .create({
        name: name
      })
      .then(sector => res.status(201).send(sector))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'name';
    const type = req.query.type ? req.query.type : 'asc';

    return sector
      .findAndCountAll({
        raw: true,
        order: [
          [sort, type]
        ],
        offset: size !== 1000 ? (page - 1) * size : 0,
        limit: size,
        attributes: [
          'id',
          'name'
        ]

      })
      .then(sector => res.json(sector))
      .catch(error => res.status(400).send(error));
  },
  delete(req, res) {
    return sector
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(sector => sector.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    return sector
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(sector => sector.update({
        name: name
      })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

};
