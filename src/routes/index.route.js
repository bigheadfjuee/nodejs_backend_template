const express = require('express')
const httpStatus = require('http-status')

const systemRoutes = require('./system.route')
const msgRoutes = require('./msg.route')
const router = express.Router()

const data = { name: 'Tony' }
router.get('/', (req, res) => {
  res.render('index.ejs', data)
})

router.get('/layout', (req, res) => {
  res.render('layout.ejs')
})

router.use('/system', systemRoutes)
router.use('/msg', msgRoutes)


router.get('/*', (req, res, next) => {
  return res.status(httpStatus.NOT_FOUND).json({ data: 'NG', message: `API not found : ${req.url}` })
})

module.exports = router
