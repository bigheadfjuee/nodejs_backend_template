const express = require('express')
const httpStatus = require('http-status')

const systemRoutes = require('./system.route')

const router = express.Router()

const data = { name: 'Tony' }
router.get('/', (req, res) => {
  res.render('index.ejs', data)
})

router.use('/system', systemRoutes)

router.get('/*', (req, res, next) => {
  return res.status(httpStatus.NOT_FOUND).json({ data: 'NG', message: `API not found : ${req.url}` })
})

module.exports = router
