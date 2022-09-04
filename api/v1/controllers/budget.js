"use strict";
const Budget = require("../models").budget;
const sequelize = require("sequelize");
const Op = sequelize.Op

const errorMessage = [
  {
    key: "inUse",
    value: "Ya existe un presupuesto para ese local con la misma fecha"
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
    Budget
      .findOne({
        where: {
          branch_id: req.body.branch_id,
          date: req.body.date
        }
      })
      .then(budget => {
        if (budget) {
          res.json({ error: true, message: findMessage("inUse"), data: budget })
        } else {
          Budget
            .create({
              branch_id: req.body.branch_id,
              date: req.body.date,
              hours: req.body.hours,
              footer: req.body.footer
            })
            .then(budget => res.status(201).json(budget))
            .catch(error => res.status(400).json(error));
        }
      })
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
          [sequelize.fn('date_format', sequelize.col('date'), '%d-%b-%Y'), 'date'],
          [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), '_date'],
          'hours',
          "program",
          'footer',
          [sequelize.fn('weekday', sequelize.col('date')), 'weekday']
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
    Budget
      .findOne({
        where: {
          branch_id: req.body.branch_id,
          date: req.body.date + " 00:00:00",
          id: {
            [Op.ne]: req.body.id
          }
        }
      })
      .then(budget => {
        if (budget) {
          res.json({ error: true, message: findMessage("inUse"), data: budget })
        } else {
          Budget
            .findOne({
              where: {
                id: req.params.id
              }
            })
            .then(budget => budget.update(
              {
                branch_id: req.body.branch_id,
                date: req.body.date,
                hours: req.body.hours,
                footer: req.body.footer
              })
              .then(result => {
                res.json(result);
              }))
            .catch(error => res.status(400).send(error));
        }
      })
  },
  delete(req, res) {
    return Budget
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then((budget) => {
        if (budget.program === 0) {
          budget.destroy()
            .then(result => {
              res.json(result);
            })
        } else {
          res.status(400).send({
            message: 'No se pudo eliminar',
            detail: `Este presupuesto no se puede eliminar porque ya tiene ${budget.program} horas consumidas`,
            data: {}
          })
        }
      })
      .catch((error) => {
        res.status(500).send({
          message: 'No se pudo eliminar',
          detail: 'Este presupuesto no se pudo eliminar debido aun error interno',
          data: error
        })
      });
  },

};
