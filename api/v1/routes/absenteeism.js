"use strict";
const absenteeism = require("../controllers/absenteeism");
const express = require("express");
const router = express.Router();

router.get("/", absenteeism.findAll);
router.post("/", absenteeism.create);
router.delete("/:id", absenteeism.delete);
router.put("/:id", absenteeism.update);
module.exports = router;
