"use strict";
const Position = require("../models").position;
const sequelize = require("sequelize");

module.exports = {

  create(req, res) {
    return Position
      .create({
        name: req.body.name,
        sector_id: req.body.sector_id
      })
      .then(position => res.status(201).send(position))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {
    const Sector = require("../models").sector;
    Position.belongsTo(Sector);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'name';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';

    return Position
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
          model: Sector,
          where: {
            id: sequelize.col('position.sector_id')
          }
        }],
        attributes: [
          'id',
          'name',
          'sector_id'
        ]
      })
      .then(positions => res.json(positions))
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return Position
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(position => position.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Position
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(position => position.update({
        name: req.body.name,
        description: req.body.description,
        percent: req.body.percent,
        status_id: req.body.status_id
      })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }

};