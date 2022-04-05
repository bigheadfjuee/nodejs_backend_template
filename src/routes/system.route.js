const express = require('express')
const ctrl = require('../controllers/system.controller')

const router = express.Router()

router.route('/')
  .get(ctrl.list)
  .post(express.json(), ctrl.set)

router.route('/:id')
  .get(ctrl.get)
  .put(express.json(), ctrl.update)
  .delete(ctrl.del)

module.exports = router
