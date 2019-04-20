"use strict";
const schedule = require("../controllers/schedule");
const express = require("express");
const router = express.Router();

router.post("/", schedule.create);
router.get("/:date/budget/:branch_id", schedule.findByBudget);
router.get("/:date/budget/:branch_id/schedule", schedule.findSchedule);
router.get("/:budget_id/timeoff", schedule.findTimeoff);
router.get("/report1/:date_from/:date_to", schedule.getConsumedBySectorReport);
router.get("/report2", schedule.getBudgetVsConsumed);
router.put("/:id", schedule.update);
router.delete("/:id", schedule.delete);

module.exports = router;
