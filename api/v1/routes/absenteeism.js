"use strict";
const absenteeism = require("../controllers/absenteeism");
const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/", absenteeism.findAll);
router.post("/", absenteeism.create);
router.delete("/:id", absenteeism.delete);
router.put("/:id", absenteeism.update);
module.exports = router;
