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

const saveNote = (id, content) =>
  new Promise((res, rej) => {
    db.run(
      `
      INSERT INTO notes
        (id, content)
      VALUES
        (?, ?)
    `,
      [id, content],
      (err) => (err ? rej(err) : res())
    )
  })

const getNote = (id) =>
  new Promise((res, rej) => {
    db.run(
      `
    SELECT * FROM notes WHERE id = ?
    `,
      [id],
      (err, row) => (err ? rej(err) : res(row))
    )
  })

module.exports = {
  saveNote,
  getNote,
}
