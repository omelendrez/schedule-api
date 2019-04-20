"use strict";
const timeoff = require("../controllers/timeoff");
const express = require("express");
const router = express.Router();

router.get("/:id/employee", timeoff.findByEmployeeId);
router.get("/:date/date", timeoff.findByDate);
router.get("/:date_from/:date_to/:absenteeism_id/:sort_by/period", timeoff.findByPeriod);
router.get("/all", timeoff.findAllTimeTimeoffs);
router.get("/", timeoff.findAll);
router.post("/", timeoff.create);
router.put("/:id", timeoff.update);
router.delete("/:id", timeoff.delete);

module.exports = router;
