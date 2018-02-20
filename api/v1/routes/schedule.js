"use strict";
const schedule = require("../controllers/schedule");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.post("/verify", schedule.verifyInput);
router.post("/", schedule.create);
router.get("/:date/budget/:branch_id", schedule.findByBudget);
router.put("/:id", schedule.update);
router.delete("/:id", schedule.delete);

module.exports = router;