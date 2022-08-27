"use strict";
const Timeoff = require("../models").timeoff;
const sequelize = require("sequelize");
const Op = sequelize.Op
const path = require("path");
const { where } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.json"))[
  env
];
const seq = new sequelize(config.database, config.username, config.password, config);
const errorMessage = [
  {
    key: "inUse",
    value: "Este empleado ya tiene cargado un ausentismo en esa fecha"
  },
  {
    key: "duplicatedTimeoff",
    value: "Este empleado ya tiene un franco cargado en esa semana ({date})"
  },
  {
    key: "dateOutOfPeriod",
    value: "La fecha que estás cargando es muy lejana ({date})"
  }
];
const findMessage = key => {
  const result = errorMessage.find(item => {
    return item.key === key;
  });
  return result.value;
};

module.exports = {
  create(req, res) {
    const employee_id = req.body.employee_id
    const absenteeism_id = req.body.absenteeism_id
    const date = req.body.date
    const forced = req.body.forced
    if (parseInt(absenteeism_id) === 1 && !forced) {
      const query = `call verify_timeoff(${employee_id},'${date}')`
      seq.query(query)
        .then(data => {
          if (data.length && data[0].error_code) {
            res.json({ warning: true, message: findMessage(data[0].error_code).replace('{date}', data[0].timeoff) });
          } else {
            return Timeoff.create({
              employee_id: employee_id,
              absenteeism_id: absenteeism_id,
              date: date
            })
              .then(timeoff => res.status(201).json(timeoff))
              .catch(error => {
                if (error.name === "SequelizeUniqueConstraintError") {
                  res.json({ error: true, message: findMessage("inUse") });
                } else {
                  res.status(400).send(error);
                }
              });
          }
        });
    } else {
      return Timeoff.create({
        employee_id: employee_id,
        absenteeism_id: absenteeism_id,
        date: date
      })
        .then(timeoff => res.status(201).json(timeoff))
        .catch(error => {
          if (error.name === "SequelizeUniqueConstraintError") {
            res.json({ error: true, message: findMessage("inUse") });
          } else {
            res.status(400).send(error);
          }
        });
    }
  },

  findAll(req, res) {
    const Employee = require("../models").employee;
    const Absenteeism = require("../models").absenteeism;
    Timeoff.belongsTo(Employee);
    Timeoff.belongsTo(Absenteeism)

    const { profile_id, branch_id } = req.decoded.data

    let where = {
      id: sequelize.col("timeoff.employee_id")
    }

    if (profile_id !== 1) {
      where = {
        ...where,
        branch_id: branch_id
      }
    }

    return Timeoff.findAndCountAll({
      raw: true,
      include: [
        {
          model: Employee,
          where: where,
          attributes: ["badge", "first_name", "last_name", "branch_id"]
        },
        {
          model: Absenteeism,
          where: {
            id: sequelize.col("timeoff.absenteeism_id")
          },
          attributes: ["name"]
        }
      ],
      order: [["date", "DESC"]],
      attributes: [
        "id",
        "employee_id",
        "absenteeism_id",
        [sequelize.fn("date_format", sequelize.col("timeoff.date"), "%d-%b-%Y"), "date"],
        [sequelize.fn("date_format", sequelize.col("timeoff.date"), "%Y-%m-%d"), "_date"],
        [sequelize.fn("date_format", sequelize.col("timeoff.created_at"), "%d-%b-%y"), "created_at"],
        [sequelize.fn("date_format", sequelize.col("timeoff.updated_at"), "%d-%b-%y"), "updated_at"]
      ]
    })
      .then(timeoff => res.json(timeoff))
      .catch(error => res.status(400).send(error));
  },

  findByEmployeeId(req, res) {
    const Employee = require("../models").employee;
    Timeoff.belongsTo(Employee);

    return Timeoff.findAndCountAll({
      where: {
        employee_id: req.params.id
      },
      include: [
        {
          model: Employee,
          where: {
            id: sequelize.col("timeoff.employee_id")
          },
          attributes: ["badge", "first_name", "last_name"]
        }
      ]
    })
      .then(
        timeoff =>
          timeoff
            ? res.json(timeoff)
            : res.status(404).json({
              error: "Not found"
            })
      )
      .catch(error => res.status(400).send(error));
  },

  findAllTimeTimeoffs(req, res) {
    return Timeoff.findAndCountAll({
      where: {
        absenteeism_id: 1
      },
      order: [['employee_id', 'ASC'], ["date", "DESC"]],
      attributes: ['employee_id', [sequelize.fn("date_format", sequelize.col("timeoff.date"), "%d-%b-%Y"), "date"]]
    })
      .then(
        timeoff =>
          timeoff
            ? res.json(timeoff)
            : res.status(404).json({
              error: "Not found"
            })
      )
      .catch(error => res.status(400).send(error));
  },

  findByDate(req, res) {
    const Employee = require("../models").employee;
    const Absenteeism = require("../models").absenteeism;
    Timeoff.belongsTo(Employee);
    Timeoff.belongsTo(Absenteeism)
    return Timeoff.findAndCountAll({
      where: {
        date: req.params.date
      },
      order: [
        [Employee, 'last_name', 'ASC'],
        [Employee, 'first_name', 'ASC']
      ],
      include: [
        {
          model: Employee,
          where: {
            id: sequelize.col("timeoff.employee_id")
          },
          attributes: ["badge", "first_name", "last_name"]
        },
        {
          model: Absenteeism,
          where: {
            id: sequelize.col("timeoff.absenteeism_id")
          },
          attributes: ["name"]
        }
      ]

    })
      .then(
        timeoff =>
          timeoff
            ? res.json(timeoff)
            : res.status(404).json({
              error: "Not found"
            })
      )
      .catch(error => res.status(400).send(error));
  },

  findByPeriod(req, res) {
    const Employee = require("../models").employee;
    const Absenteeism = require("../models").absenteeism;
    let order = ''
    switch (req.params.sort_by) {
      case '0':
        order = [
          [Employee, 'last_name', 'ASC'],
          [Employee, 'first_name', 'ASC'],
          ['date', 'ASC']
        ]
        break
      case '1':
        order = [
          ['date', 'ASC'],
          [Employee, 'last_name', 'ASC'],
          [Employee, 'first_name', 'ASC']
        ]
        break
    }
    Timeoff.belongsTo(Employee);
    Timeoff.belongsTo(Absenteeism)
    return Timeoff.findAndCountAll({
      where: {
        date: {
          [Op.between]: [req.params.date_from, req.params.date_to]
        }
      },
      attributes: [
        [sequelize.fn("date_format", sequelize.col("timeoff.date"), "%d-%b-%y"), "date"],
        [sequelize.fn("weekday", sequelize.col("timeoff.date")), "week_day"],
        'absenteeism_id'
      ],
      order: order,
      include: [
        {
          model: Employee,
          where: {
            id: sequelize.col("timeoff.employee_id")
          },
          attributes: ["badge", "first_name", "last_name"]
        },
        {
          model: Absenteeism,
          where: {
            id: sequelize.col("timeoff.absenteeism_id")
          },
          attributes: ["name"]
        }
      ]

    })
      .then(
        timeoff =>
          timeoff
            ? res.json(timeoff)
            : res.status(404).json({
              error: "Not found"
            })
      )
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return Timeoff.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(timeoff =>
        timeoff.destroy().then(result => {
          res.json(result);
        })
      )
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Timeoff.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(timeoff =>
        timeoff
          .update({
            employee_id: req.body.employee_id,
            absenteeism_id: req.body.absenteeism_id,
            date: req.body.date
          })
          .then(result => {
            res.json(result);
          })
      )
      .catch(error => res.status(400).send(error));
  }
};
