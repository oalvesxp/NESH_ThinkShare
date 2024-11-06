const express = require('express')
const { saveNote } = require('./db')
const app = express()
const PORT = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/note/:id', (req, res) => {
  res.sendFile(__dirname + '/public/note.html')
})

app.post('/notes', async (req, res) => {
  const { content } =
    req.body /** Content-Type: application/x-www-form-urlencoded */

  if (!content) {
    return res.send(
      `<span>Erro inesperado!</span>`
    ) /** retorna HTML para o HTMX */
  }

  const id = crypto.randomUUID()
  await saveNote(id, content)
  res
    .send(
      `
      <p>Compartilhe sua nota através do link:</p>
      <span>${req.headers.origin}/note/${id}</span>
      `
    )
    .pipe(res.setHeader('Access-Control-Allow-Origin', origin))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
