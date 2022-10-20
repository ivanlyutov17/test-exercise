const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { StatusCodes, Messages } = require('./helpers/constants')
const cors = require('cors')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))
app.use(cors())

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  if (!questions) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: Messages.NOT_FOUND })
  }
  return res.status(StatusCodes.OK).json({ questions: questions })
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId
  )
  if (!question) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: Messages.NOT_FOUND })
  }
  return res.status(StatusCodes.OK).json({ question: question })
})

app.post('/questions', (req, res) => {})

app.get('/questions/:questionId/answers', (req, res) => {})

app.post('/questions/:questionId/answers', (req, res) => {})

app.get('/questions/:questionId/answers/:answerId', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
