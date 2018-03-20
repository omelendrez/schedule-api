"use strict";
const timeoff = require("../controllers/timeoff");
const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/:id/employee", timeoff.findByEmployeeId);
router.get("/:id/date", timeoff.findByDate);
router.get("/", timeoff.findAll);
router.post("/", timeoff.create);
router.put("/:id", timeoff.update);
router.delete("/:id", timeoff.delete);

module.exports = router;
