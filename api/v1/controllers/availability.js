"use strict";
const Availability = require("../models").availability;

module.exports = {
  create(req, res) {
    const employee_id = req.body.employee_id;
    const mo = req.body.mo;
    const tu = req.body.tu;
    const we = req.body.we;
    const th = req.body.th;
    const fr = req.body.fr;
    const sa = req.body.sa;
    const su = req.body.su;

    return Availability
      .create({
        employee_id: employee_id,
        mo: mo,
        tu: tu,
        we: we,
        th: th,
        fr: fr,
        sa: sa,
        su: su
      })
      .then(availability => res.status(201).json(availability))
      .catch(error => res.status(400).json(error));
    },

  findAll(req, res) {
    return Availability
      .findAll({
        raw: true
      })
      .then(availability => res.json(availability))
      .catch(error => res.status(400).send(error));
  }
};