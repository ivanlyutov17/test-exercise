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
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    if (!questions) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: Messages.NOT_FOUND })
    }
    return res.status(StatusCodes.OK).json({ questions: questions })
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: e.message })
  }
})

app.get('/questions/:questionId', async (req, res) => {
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      req.params.questionId
    )
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: Messages.NOT_FOUND })
    }
    return res.status(StatusCodes.OK).json({ question: question })
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: e.message })
  }
})

app.post('/questions', async (req, res) => {
  try {
    const question = await req.body
    if (question) {
      await req.repositories.questionRepo.addQuestion(question)
      return res.status(StatusCodes.OK).json({ msg: Messages.QUEST_ADDED })
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: Messages.NO_QUESTION })
    }
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: e.message })
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  try {
    const answers = await req.repositories.questionRepo.getAnswers(
      req.params.questionId
    )
    if (answers) return res.status(StatusCodes.OK).json({ answers: answers })
    return res.status(StatusCodes.NOT_FOUND).json({ msg: Messages.NO_ANSWERS })
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: e.message })
  }
})

app.post('/questions/:questionId/answers', async (req, res) => {
  try {
    const answer = req.body
    const questionId = req.params.questionId
    if (answer) {
      await req.repositories.questionRepo.addAnswer(questionId, answer)
      return res.status(StatusCodes.OK).json({ msg: Messages.ANSWER_ADDED })
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: Messages.NO_ANSWERS })
    }
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: e.message })
  }
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  try {
    const { answerId, questionId } = req.params
    if (answerId && questionId) {
      const answer = await req.repositories.questionRepo.getAnswer(
        questionId,
        answerId
      )
      if (answer) return res.status(StatusCodes.OK).json({ answer: answer })
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: Messages.NO_ANSWERS })
    } else
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: Messages.NO_QUEST_OR_ANSWER })
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: e.message })
  }
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
