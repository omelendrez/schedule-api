'use strict'
const Absenteeism = require('../models').absenteeism
const sequelize = require('sequelize')

module.exports = {
  create(req, res) {
    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
    const status_id = req.body.status_id

    return Absenteeism.create({
      name: name,
      status_id: status_id
    })
      .then((absenteeism) => res.status(201).json(absenteeism))
      .catch((error) => res.status(400).json(error))
  },

  findAll(req, res) {
    const Status = require('../models').status
    Absenteeism.belongsTo(Status)

    return Absenteeism.findAndCountAll({
      raw: true,
      include: [
        {
          model: Status,
          where: {
            id: sequelize.col('absenteeism.status_id')
          },
          attributes: ['name']
        }
      ],
      attributes: [
        'id',
        'name',
        'status_id',
        [
          sequelize.fn(
            'date_format',
            sequelize.col('absenteeism.created_at'),
            '%d-%b-%y'
          ),
          'created_at'
        ],
        [
          sequelize.fn(
            'date_format',
            sequelize.col('absenteeism.updated_at'),
            '%d-%b-%y'
          ),
          'updated_at'
        ]
      ]
    })
      .then((absenteeism) => res.json(absenteeism))
      .catch((error) => res.status(400).send(error))
  },

  delete(req, res) {
    return Absenteeism.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((absenteeism) =>
        absenteeism
          .update({
            status_id: absenteeism.status_id === 1 ? 2 : 1
          })
          .then((result) => {
            res.json(result)
          })
      )
      .catch((error) => res.status(400).send(error))
  },

  update(req, res) {
    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
    return Absenteeism.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((absenteeism) =>
        absenteeism
          .update({
            name: name
          })
          .then((result) => {
            res.json(result)
          })
      )
      .catch((error) => res.status(400).send(error))
  }
}
