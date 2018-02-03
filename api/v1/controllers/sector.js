"use strict";
const sector = require("../models").sector;
const sequelize = require("sequelize");
const Op = sequelize.Op
module.exports = {
  create(req, res) {
    let last_id = 0;
    sector.max("id").then(max => {

      last_id = max;
      if (isNaN(last_id)) {
        last_id = 0;
      }
      last_id = ("0".repeat(3) + (Number(last_id.toString()) + 1).toString()).slice(-3);
      const cat = ("0".repeat(2) + (Number(req.body.category_id)).toString()).slice(-2);
      const sub_cat = ("0".repeat(2) + (Number(req.body.sub_category_id)).toString()).slice(-2);
      const code = cat + '-' + sub_cat + '-' + last_id;

      return sector
        .create({
          code: code,
          name: req.body.name,
          description: req.body.description,
          category_id: req.body.category_id,
          sub_category_id: req.body.sub_category_id,
          status_id: req.body.status_id,
          price: req.body.price
        })
        .then(sector => res.status(201).send(sector))
        .catch(error => res.status(400).send(error));
    });
  },

  findAll(req, res) {
    const Category = require("../models").category;
    const SubCategory = require("../models").sub_category;
    const Status = require("../models").status;

    sector.belongsTo(Category);
    sector.belongsTo(SubCategory);
    sector.belongsTo(Status);

    const page = parseInt(req.query.page ? req.query.page : 0);
    const size = parseInt(req.query.size ? req.query.size : 1000);
    const sort = req.query.sort ? req.query.sort : 'name';
    const type = req.query.type ? req.query.type : 'asc';
    const filter = req.query.filter ? req.query.filter : '';
    const status = req.query.status ? [req.query.status] : [1, 2];

    const ord =  (parseInt(status) === 1) ? [sequelize.fn('RAND', '')] : [sort, type];

    return sector
      .findAndCountAll({
        where: {
          name: {
            $like: '%' + filter + '%'
          },
          status_id: {
            [Op.in]: status
          }
        },
        order: ord,
        offset: size !== 1000 ? (page - 1) * size : 0,
        limit: size,
        include: [{
          model: Category,
          where: {
            id: sequelize.col('sector.category_id')
          }
        }, {
          model: SubCategory,
          where: {
            id: sequelize.col('sector.sub_category_id')
          }
        }, {
          model: Status,
          where: {
            id: sequelize.col('sector.status_id')
          }
        }],
        attributes: [
          'id',
          'code',
          'name',
          'description',
          'image',
          'price',
          'category_id',
          'sub_category_id'
        ]
      })
      .then(sectors => res.json(sectors))
      .catch(error => res.status(400).send(error));
  },

  findById(req, res) {
    const Category = require("../models").category;
    const SubCategory = require("../models").sub_category;
    const Status = require("../models").status;

    sector.belongsTo(Category);
    sector.belongsTo(Status);
    sector.belongsTo(SubCategory);

    return sector
      .findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: Category,
          where: {
            id: sequelize.col('sector.category_id')
          }
        }, {
          model: SubCategory,
          where: {
            id: sequelize.col('sector.sub_category_id')
          }
        }, {
          model: Status,
          where: {
            id: sequelize.col('sector.status_id')
          }
        }],
        attributes: [
          'id',
          'code',
          'name',
          'description',
          'price',
          'image',
          'category_id',
          'sub_category_id',
          'status_id', [sequelize.fn('date_format', sequelize.col('sector.created_at'), '%d-%b-%y %H:%i'), 'created_at'],
          [sequelize.fn('date_format', sequelize.col('sector.updated_at'), '%d-%b-%y %H:%i'), 'updated_at']
        ]
      })
      .then(sector => sector ? res.json(sector) : res.status(404).json({
        "error": "Not found"
      }))
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
    return sector
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(sector => sector.update({
          code: req.body.code,
          name: req.body.name,
          description: req.body.description,
          category_id: req.body.category_id,
          sub_category_id: req.body.sub_category_id,
          status_id: req.body.status_id,
          price: req.body.price
        })
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  },

};