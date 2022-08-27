"use strict";
const schedule = require("../controllers/schedule");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.post("/", secure, schedule.create);
router.get("/:date/budget/:branch_id", secure, schedule.findByBudget);
router.get("/:date/budget/:branch_id/schedule", secure, schedule.findSchedule);
router.get("/:budget_id/timeoff", secure, schedule.findTimeoff);
router.get("/report1/:date_from/:date_to", secure, schedule.getConsumedBySectorReport);
router.get("/report2", secure, schedule.getBudgetVsConsumed);
router.put("/:id", secure, schedule.update);
router.delete("/:id", secure, schedule.delete);

module.exports = router;
