"use strict";
const position = require("../controllers/position");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/", position.findAll);
router.post("/", position.create);
router.put("/:id", position.update);
router.delete("/:id", position.delete);

module.exports = router;