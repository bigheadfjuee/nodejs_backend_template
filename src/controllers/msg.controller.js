const httpStatus = require('http-status')

function postMsg (req, res, next) {
  console.log(req.body)    
  return res.status(httpStatus.OK).json({data: 'ok'})  
}


module.exports = { postMsg }