"use strict";
const timeoff = require("../controllers/timeoff");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/:id/employee", secure, timeoff.findByEmployeeId);
router.get("/:date/date", secure, timeoff.findByDate);
router.get("/:date_from/:date_to/:absenteeism_id/:sort_by/period", secure, timeoff.findByPeriod);
router.get("/all", secure, timeoff.findAllTimeTimeoffs);
router.get("/", secure, timeoff.findAll);
router.post("/", secure, timeoff.create);
router.put("/:id", secure, timeoff.update);
router.delete("/:id", secure, timeoff.delete);

module.exports = router;
