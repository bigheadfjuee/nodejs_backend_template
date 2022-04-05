// Tony : 因為 Windows(x64), macOS(ARM M1) 目前都裝不起來 better-sqlite3
// 退而求其次，使用 sqlite3，但要自行處理 Callback => Promise 的部份
const Sqlite3 = require('sqlite3') 
const dbName = 'mydb.db'

let instance
const Database = function () {
  this.database = new Sqlite3.Database(dbName, (err) => {
    if(err) console.error(err);
  })
}

Database.prototype.init = function () {
  _initTable(this.database)
}

function _initTable (database) {
  const sqls = [system()]
  sqls.forEach(sql => {
    database.exec(sql)
  })
}

function system () {
  return `CREATE TABLE IF NOT EXISTS system (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    key TEXT UNIQUE NOT NULL,
    value TEXT
  );`
}

Database.prototype.reset = function () {
  const database = this.database
  _deleteTable()

  function _deleteTable () {
    const tables = database.prepare(`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT IN ('log', 'sqlite_sequence')
    `).all()

    if (tables.length === 0) return

    // NOTE: DROP TABLE 會有外鍵連結的順序問題，所以用 try..catch，加上遞迴
    for (const table of tables) {
      try {
        database.prepare(`DROP TABLE IF EXISTS '${table.name}'`).run()
      } catch (e) { }
    }
    _deleteTable()
  }
}

// return [ 'key1 = $key1', 'key2 = $key2', ... ]
Database.prototype.getKeyPair = function (obj, skip = []) {
  const keyPair = []
  for (const key of Object.keys(obj)) {
    if (skip.includes(key)) continue
    keyPair.push(`${key} = $${key}`)
  }
  return keyPair
}

// NOTE: sqlite3 不吃物件、布林等等，利用該函數將指定欄位 stringify
Database.prototype.toString = function (obj, columns = []) {
  if (!obj) return obj

  for (const key of columns) {
    if (obj[key] === undefined) continue
    obj[key] = (obj[key] === null) ? obj[key] : JSON.stringify(obj[key])
  }
  return obj
}

// NOTE: sqlite3 只存字串，利用該函數將指定欄位 parse
Database.prototype.parse = function (obj, columns = []) {
  if (!obj) return obj

  for (const key of columns) {
    obj[key] = JSON.parse(obj[key])
  }
  return obj
}

Database.prototype.begin = function () {
  return new Promise((resolve, reject) => {
    try {
      this.database.prepare('BEGIN').run()
      resolve()
    } catch (error) {
      this.database.prepare('ROLLBACK').run()
      reject(error)
    }
  })
}

Database.prototype.rollback = function () {
  return new Promise((resolve, reject) => {
    try {
      this.database.prepare('ROLLBACK').run()
      resolve()
    } catch (error) {
      this.database.prepare('ROLLBACK').run()
      reject(error)
    }
  })
}

Database.prototype.commit = function () {
  return new Promise((resolve, reject) => {
    try {
      this.database.prepare('COMMIT').run()
      resolve()
    } catch (error) {
      this.database.prepare('ROLLBACK').run()
      reject(error)
    }
  })
}

module.exports = exports = (() => {
  if (instance) {
    return instance
  }

  instance = new Database()
  return instance
})()
