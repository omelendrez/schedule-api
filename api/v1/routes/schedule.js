"use strict";
const schedule = require("../controllers/schedule");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.post("/", schedule.create);
router.get("/:id", schedule.findById);
router.get("/:id/budget", schedule.findByBudgetId);
router.put("/:id", schedule.update);
router.delete("/:id", schedule.delete);

module.exports = router;