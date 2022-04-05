const cors = require('cors')
const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')

const routes = require('./routes/index.route')
const DB = require('./db')

const app = express()
const server = require('http').Server(app)
const ws = require('socket.io')(server, {
  transports: ['websocket', 'polling'],
  pingInterval: 40000,
  pingTimeout: 25000
})

const SERVER_PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '../public')))

app.use(cors())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.ws = ws
  next()
})

DB.init()

app.use('/', routes)

// NOTE: 這裡要改用 server，不能用 app，不然 websocket 會失效
// app.listen(SERVER_PORT, async () => {
server.listen(SERVER_PORT, () => {
  initWS(ws)
  console.log(`http://localhost:${SERVER_PORT}`)

  ws.emit('init', { data: 'ok' })
})

function initWS (ws) {
  ws.on('connection', client => {
    // console.log('ws.on:connection')

    client.on('disconnect', () => {
      // console.log('ws - disconnect')
    })
  })
}

module.exports = app
