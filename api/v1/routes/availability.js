"use strict";
const availability = require("../controllers/availability");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/", availability.findAll);
router.get("/:id", availability.findById);
router.get("/:id/employee", availability.findByEmployeeId);
router.post("/", availability.create);
router.put("/:id", availability.update);

module.exports = router;