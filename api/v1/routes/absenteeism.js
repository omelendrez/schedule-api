"use strict";
const absenteeism = require("../controllers/absenteeism");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, absenteeism.findAll);
router.post("/", secure, absenteeism.create);
router.delete("/:id", secure, absenteeism.delete);
router.put("/:id", secure, absenteeism.update);
module.exports = router;
