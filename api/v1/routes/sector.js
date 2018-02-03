"use strict";
const sector = require("../controllers/sector");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/:id", sector.findById);
router.get("/", sector.findAll);
router.post("/", sector.create);
router.put("/:id", sector.update);
router.delete("/:id", sector.delete);

module.exports = router;