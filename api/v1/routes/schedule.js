"use strict";
const schedule = require("../controllers/schedule");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.post("/", schedule.create);
router.delete("/:id", schedule.delete);

module.exports = router;