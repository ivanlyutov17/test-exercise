const StatusCodes = {
  OK: 200,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
}
const Messages = {
  NOT_FOUND: 'Error',
  NO_QUESTION: 'No question has been passed',
  QUEST_ADDED: 'Queestion added successfully',
  NO_ANSWERS: 'No answers found',
  ANSWER_ADDED: 'An answer was added successfully',
  NO_QUEST_OR_ANSWER: 'No answerId or questionId was passed'
}

module.exports = { StatusCodes, Messages }
