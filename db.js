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

const markAsOpened = (id) =>
  new Promise((res, rej) => {
    db.run(
      `
        UPDATE notes
        SET opened_at = datetime('now', 'localtime')
        WHERE id = ?
      `,
      [id],
      (err) => (err ? rej(err) : res())
    )
  })

const deletedExpires = () =>
  new Promise((res, rej) => {
    db.run(
      `
        DELETE FROM notes
        WHERE 
          opened_at < datetime('now', 'localtime', '-5 minutes')
          OR opened_at IS NULL 
            AND created_at < datetime('now', 'localtime', '-7 days')
      `,
      (err) => (err ? rej(err) : res())
    )
  })

module.exports = {
  saveNote,
  getNote,
  markAsOpened,
  deletedExpires,
}
