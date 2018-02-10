"use strict";
const budget = require("../controllers/budget");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/", budget.findAll);
router.post("/", budget.create);
router.put("/:id", budget.update);
router.delete("/:id", budget.delete);

module.exports = router;