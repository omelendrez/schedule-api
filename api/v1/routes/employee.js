'use strict'
const employee = require('../controllers/employee')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get('/:id', secure, employee.findById)
router.get('/:id/branch', secure, employee.findByBranchId)
router.get('/', secure, employee.findAll)
router.post('/', secure, employee.create)
router.put('/:id', secure, employee.update)
router.delete('/:id', secure, employee.delete)

module.exports = router
