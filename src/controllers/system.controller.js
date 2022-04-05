const httpStatus = require('http-status')
const Model = require('../models/system.model')
const APIError = require('../lib/APIError')

async function list (req, res, next) {
  try {
    const data = await Model.list()
    return res.status(httpStatus.OK).json(data)
  } catch (e) {
    next(new APIError({ status: httpStatus.UNAUTHORIZED, message, code: 'E0401' }))
    next(e)
  }
}

async function get (req, res, next) {
  try {
    const data = await Model.get(req.params.id)
    if(data)
      return res.status(httpStatus.OK).json(data)
    
      res.status(httpStatus.OK).json({data:'ng', reason:'not found'})
  } catch (e) {
    next(e)
  }
}

async function set (req, res, next) {
  try {
    Model.add(req.body)
    return res.status(httpStatus.OK).json({data: 'ok'})
  } catch (e) {
    next(e)
  }
}

async function update (req, res, next) {
  try {
    Model.set(req.params.id, req.body)
    return res.status(httpStatus.OK).json({data: 'ok'})
  } catch (e) {
    next(e)
  }
}

function del (req, res, next) {
  try {
    Model.del(req.params.id)
    return res.status(httpStatus.OK).json({data: 'ok'})
  } catch (e) {
    next(e)
  }
}

module.exports = { list, get, set, update, del }
