"use strict";
const employee = require("../controllers/employee");
const express = require("express");
const router = express.Router();

router.get("/:id", employee.findById);
router.get("/:id/branch", employee.findByBranchId);
router.get("/", employee.findAll);
router.post("/", employee.create);
router.put("/:id", employee.update);
router.delete("/:id", employee.delete);

module.exports = router;