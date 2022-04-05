const Sqlite = require('../db').database

function list() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM system'
    Sqlite.prepare(sql).all((err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

function get(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM system WHERE id = ${id}`
    Sqlite.prepare(sql).get((err, row) => {
      if (err) reject(err)
      resolve(row)
    })
  })
}

function add(obj) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO system (key, value) VALUES ($key, $value)'
    const param = {
      $key: obj.key,
      $value: obj.value 
    }
    Sqlite.prepare(sql).run(param, (result, err) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

function set(id, obj) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE system SET value = $value, key = $key WHERE id = ${id}`
    const param = {
      $key: obj.key,
      $value: obj.value
    }
    Sqlite.prepare(sql).run(param, (result, err) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

function del(id) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE from system WHERE id = ${id}`
    Sqlite.prepare(sql).run((err) => {
      if (err) reject(err)
      resolve(true)
    })
  })
}

module.exports = { list, get, set, add, del }
