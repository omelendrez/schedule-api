"use strict";
const Profile = require("../models").profile;

module.exports = {

  create(req, res) {
    return Profile
      .create({
        name: req.body.name
      })
      .then(profile => res.status(201).send(profile))
      .catch(error => res.status(400).send(error));
  },

  findAll(req, res) {

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'name';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';

    return Profile
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
        attributes: [
          'id',
          'name'
        ]
      })
      .then(profiles => res.json(profiles))
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return Profile
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(profile => profile.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Profile
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(profile => profile.update({
        name: req.body.name
      })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }

};