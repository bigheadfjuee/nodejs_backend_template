const express = require('express')
const ctrl = require('../controllers/msg.controller')

const router = express.Router()

router.route('/')
  .post(express.json(), ctrl.postMsg)

module.exports = router
