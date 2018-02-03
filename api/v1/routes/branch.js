"use strict";
const branch = require("../controllers/branch");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/", branch.findAll);
router.post("/", branch.create);

module.exports = router;