"use strict";
const User = require("../models").user;
const sequelize = require("sequelize");
const jwt = require('jsonwebtoken')
const Op = sequelize.Op

const errorMessage = [
  {
    key: "inUse",
    value: "Ese nombre de usuario ya está asignado a otro usuario"
  }
]
const findMessage = ((key) => {
  const result = errorMessage.find(item => {
    return item.key === key
  })
  return result.value
})
module.exports = {
  create(req, res) {
    User.findOne({
      where: {
        user_name: req.body.user_name
      }
    })
      .then(user => {
        if (user) {
          res.json({ error: true, message: findMessage("inUse") })
        } else {
          const fullName = req.body.full_name.split(" ")
          for (let i = 0; i < fullName.length; i++) {
            fullName[i] = fullName[i].charAt(0).toUpperCase() + fullName[i].slice(1)
          }
          User
            .create({
              user_name: req.body.user_name,
              full_name: fullName.join(" "),
              profile_id: req.body.profile_id,
              branch_id: req.body.branch_id
            })
            .then(user => res.status(201).json(user))
            .catch(error => res.status(400).send(error));
        }
      })
  },

  findAll(req, res) {
    const Status = require("../models").status;
    const Profile = require("../models").profile;
    const Branch = require("../models").branch;
    User.belongsTo(Status);
    User.belongsTo(Profile);
    User.belongsTo(Branch);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'full_name';
    const type = req.query.type ? req.query.type : 'asc';

    return User
      .findAndCountAll({
        raw: true,
        order: [
          [sort, type]
        ],
        offset: size !== 1000 ? (page - 1) * size : 0,
        limit: size,
        include: [{
          model: Status,
          where: {
            id: sequelize.col('user.status_id')
          },
          attributes: [
            'name'
          ]
        }, {
          model: Profile,
          where: {
            id: sequelize.col('user.profile_id')
          },
          attributes: [
            'name'
          ]
        }, {
          model: Branch,
          where: {
            id: sequelize.col('user.branch_id')
          },
          attributes: [
            'name'
          ]
        }],
        attributes: [
          'id',
          'user_name',
          'full_name',
          'status_id',
          'profile_id',
          'branch_id',
          [sequelize.fn('date_format', sequelize.col('user.created_at'), '%d-%b-%y'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('user.updated_at'), '%d-%b-%y'), 'updated_at']
        ]
      })
      .then(users => res.json(users))
      .catch(error => {
        console.log(error)
        res.status(400).json(error)
      });
  },

  findById(req, res) {
    const Status = require("../models").status;
    User.belongsTo(Status);
    const Profile = require("../models").profile;
    User.belongsTo(Profile);
    const Branch = require("../models").branch;
    User.belongsTo(Branch);

    return User
      .findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: Status,
          where: {
            id: sequelize.col('user.status_id')
          }
        }, {
          model: Profile,
          where: {
            id: sequelize.col('user.profile_id')
          }
        }, {
          model: Branch,
          where: {
            id: sequelize.col('user.branch_id')
          }
        }]
      })
      .then(user => user ? res.json(user) : res.status(404).json({
        "error": "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },

  login(req, res) {
    return User
      .findOne({
        where: {
          user_name: req.body.user_name,
          password: req.body.password,
          status_id: 1
        }
      })
      .then((user) => {
        if (user) {
          const token = jwt.sign({
            data: user.toWeb()
          }, process.env.JWT_SECRET, { expiresIn: '1d' }, { algorithm: 'RS256' });
          res.json({ ...user.toWeb(), token })
        } else {
          res.status(401).json({
            message: 'Credenciales inválidas',
            detail: 'El usuario o password ingresados son incorrectos. Por favor corrija las credenciales y vuelva a intentar.'
          })
        }
      })
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return User
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(user => user.update({
        status_id: user.status_id === 1 ? 2 : 1
      })
        .then(() => {
          res.json({ status: true });
        }))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {

    User.findOne({
      where: {
        user_name: req.body.user_name,
        id: {
          [Op.ne]: req.body.id
        }
      }
    })
      .then(user => {
        if (user) {
          res.json({ error: true, message: findMessage("inUse") })
        } else {
          const fullName = req.body.full_name.split(" ")
          for (let i = 0; i < fullName.length; i++) {
            fullName[i] = fullName[i].charAt(0).toUpperCase() + fullName[i].slice(1)
          }
          User
            .findOne({
              where: {
                id: req.params.id
              }
            })
            .then(user => user.update(
              {
                user_name: req.body.user_name,
                full_name: fullName.join(" "),
                profile_id: req.body.profile_id,
                branch_id: req.body.branch_id
              })
              .then(result => {
                res.json(result);
              }))
            .catch(error => res.status(400).send(error));
        }
      })
  },
  changePassword(req, res) {
    return User
      .findOne({
        where: {
          id: req.params.id,
          password: req.body.password_current
        }
      })
      .then(user => user.update(
        {
          password: req.body.password_new
        })
        .then(result => {
          res.json(result);
        })
        .catch(error => res.json({
          error: error,
          msg: "No se pudo cambiar la password"
        }))
      )
      .catch(error => res.json({
        error: error,
        msg: "Password actual no es correcta"
      }));
  }
};
