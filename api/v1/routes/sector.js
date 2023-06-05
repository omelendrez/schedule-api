"use strict";
const sector = require("../controllers/sector");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, sector.findAll);
router.post("/", secure, sector.create);
router.put("/:id", secure, sector.update);
router.delete("/:id", secure, sector.delete);

module.exports = router;
