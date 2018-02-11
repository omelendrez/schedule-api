"use strict";
const Position = require("../models").position;
const sequelize = require("sequelize");

module.exports = {

  create(req, res) {
    return Position
      .create({
        name: req.body.name,
        sector_id: req.body.sector_id,
        color: req.body.color
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
        raw: true,
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
        attributes: [
          'id',
          'name',
          'sector_id',
          'color',
          [sequelize.fn('date_format', sequelize.col('position.created_at'), '%d-%b-%y'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('position.updated_at'), '%d-%b-%y'), 'updated_at']
        ],
        include: [{
          model: Sector,
          where: {
            id: sequelize.col('position.sector_id')
          },
          attributes: [
            'name'
          ]
        }]
      })
      .then(position => res.json(position))
      .catch(error => res.status(400).send(error));
  },
  findBySectorId(req, res) {

    return Position
      .findAndCountAll({
        where: {
          sector_id: req.params.id
        },
      })
      .then(position => position ? res.json(position) : res.status(404).json({
        "error": "Not found"
      }))
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
      .then(position => position.update(
        {
          name: req.body.name,
          sector_id: req.body.sector_id,
          color: req.body.color
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }

};