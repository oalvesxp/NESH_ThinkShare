const express = require('express')
const { saveNote, getNote, markAsOpened, deletedExpires } = require('./db')
const app = express()
const PORT = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/notes', async (req, res) => {
  const { content } =
    req.body /** Content-Type: application/x-www-form-urlencoded */

  if (!content) {
    return res.send(
      `<span class="error">Erro inesperado!</span>`
    ) /** retorna HTML para o HTMX */
  }

  const id = crypto.randomUUID()
  await saveNote(id, content)
  res.send(
    `
    <p>Compartilhe sua nota através do link:</p>
    <span><a href="${req.headers.origin}/note/${id}" target="_blank">${req.headers.origin}/note/${id}</a></span>
    `
  )
})

app.get('/note/:id', (req, res) => {
  res.sendFile(__dirname + '/public/note.html')
})

app.get('/share/:id', async (req, res) => {
  await deletedExpires()

  const { id } = req.params
  const note = await getNote(id)

  if (!note) {
    res.send(`<span class="error">Este post-it molhou e se desfez!</span>`)
  }

  if (!note.opened_at) {
    await markAsOpened(id)
  }

  res.send(note.content)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
