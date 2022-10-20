const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const question = questions.find(el => (el.id = questionId))

    return question
  }
  const addQuestion = async question => {
    try {
      const questions = await getQuestions()
      questions.push(question)
      await writeFile(fileName, JSON.stringify(questions), {
        encoding: 'utf-8'
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  const getAnswers = async questionId => {
    try {
      const questions = await getQuestions()
      const question = questions.find(el => el.id === questionId)
      return question.answers
    } catch (e) {
      console.log(e)
    }
  }
  const getAnswer = async (questionId, answerId) => {
    try {
      const questions = await getQuestions()
      return questions
        .find(el => el.id === questionId)
        .answers.find(el => el.id === answerId)
    } catch (e) {
      console.log(e)
    }
  }
  const addAnswer = async (questionId, answer) => {
    try {
      const questions = await getQuestions()
      questions.forEach(el => {
        if (el.id === questionId) {
          el.answers.push(answer)
        }
      })
      await writeFile(fileName, JSON.stringify(questions), {
        encoding: 'utf-8'
      })
    } catch (e) {
      console.log(e)
    }
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
