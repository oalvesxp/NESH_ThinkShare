const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./notes.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes 
      (
        id TEXT PRIMARY KEY
        , content TEXT
        , opened_at DATE DEFAULT null
        , created_at DATE DEFAULT (datetime('now', 'localtime'))
      )
  `)
})
