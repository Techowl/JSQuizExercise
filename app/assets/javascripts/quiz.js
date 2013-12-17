$(function() {
  Sessions.init()
})

var Sessions = {
  iD: 0,
  quizID: 0,
  numCorrect: 0,
  numIncorrect: 0,
  mostRecentResult: false,

  init: function() {
    Sessions.iD = Math.floor(Math.random() * 100000000000)
    $('form#submission').on("submit", Sessions.displaySelectedQuiz.bind(Sessions))
    $('#play-again-button').on("click", location.reload.bind(location))
    Sessions.displayQuizSelector()
  },

  displayQuizSelector: function() {
    $('.question-display').text("Which quiz would you like to take?")
    $.get('/quizzes.json').done(this.displayQuizzes)
  },

  displayQuizzes: function(data, textStatus, jqXHR) {
    var quizzes = data.quizzes
    for (var i in quizzes) {
      Sessions.produceQuizOptionFromTemplate(quizzes[i])
    }
  },

  produceQuizOptionFromTemplate: function(quiz) {
    var source = $('#choice-template').html()
    var template = Handlebars.compile(source)
    var context = {value: quiz.quiz_id, choice: quiz.name}
    $(".choice-display").append(template(context))
  },

  displaySelectedQuiz: function(e) {
    e.preventDefault()
    Sessions.quizID = $('form#submission option:selected').val()
    QuizQuestions.init()
  }
}

var QuizQuestions = {
  iD: 0,

  init: function() {
    $('.choice-display').html('')
    this.displayNextQuestion()
    this.displayCorrectAndIncorrectAnswerFields()
    this.changeSubmitButtonAction()
  },

  displayNextQuestion: function() {
    $.get('/quizzes/' + Sessions.quizID + '/questions/next.json', {session_key: Sessions.iD})
    .done(this.appendQuestionAndChoices.bind(this))
    .error(this.displayFinalScreen.bind(this))
  },

  appendQuestionAndChoices: function(data, textStatus, jqXHR){
    $(".question-display").text(data.question.question)
    QuizQuestions.iD = data.question.question_id
    var choices = data.question.choices
    for (var i in choices) {
      this.produceAnswerFromTemplate(choices[i])
    }
  },

  produceAnswerFromTemplate: function(choice) {
    var source = $('#choice-template').html()
    var template = Handlebars.compile(source)
    var context = {value: choice.choice_id, choice: choice.choice}
    $(".choice-display").append(template(context))
  },

  displayCorrectAndIncorrectAnswerFields: function() {
    $('.num-correct').removeClass('hidden')
    $('.num-incorrect').removeClass('hidden')
  },

  displayNumCorrectAndIncorrect: function() {
    $('.num-correct').text("Correct answers: " + Sessions.numCorrect)
    $('.num-incorrect').text("Incorrect answers: " + Sessions.numIncorrect)
  },

  changeSubmitButtonAction: function() {
    $('form#submission').off("submit")
    $('form#submission').on("submit", AnswerSubmission.submitUserAnswer.bind(AnswerSubmission))
  },

  displayFinalScreen: function() {
    $('form#submission').html('')
    $('.question-display').text("Quiz completed!")
    $('#play-again-button').removeClass('hidden')
  }
}

var AnswerSubmission = {
  choiceID: 0,

  submitUserAnswer: function(e){
    e.preventDefault()
    AnswerSubmission.choiceID = $('form#submission option:selected').val()
    $.post("/questions/" + QuizQuestions.iD + "/answers.json", {session_key: Sessions.iD, choice_id: AnswerSubmission.choiceID})
    .done(this.updateSessions.bind(this))
  },

  updateSessions: function(data, textStatus, jqXHR) {
    $(".correctness-indicator").addClass("hidden")
    Sessions.numCorrect = data.status.num_correct
    Sessions.numIncorrect = data.status.num_incorrect
    Sessions.mostRecentResult = data.status.correct
    AnswerSubmission.updateAllDisplayedValues()
  },

  updateAllDisplayedValues: function() {
    $(".choice-display").html("")
    this.displayAppropriateCorrectnessIndicator()
    QuizQuestions.displayNumCorrectAndIncorrect()
    QuizQuestions.displayNextQuestion()
  },

  displayAppropriateCorrectnessIndicator: function() {
    if (Sessions.mostRecentResult) {
      $(".last-right").toggleClass("hidden")
    } else {
      $(".last-wrong").toggleClass("hidden")
    }
  }
}

