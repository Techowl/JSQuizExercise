$(document).ready(function() {
  Sessions.init()
  $('form#submission').on("submit", Sessions.onFormSubmit.bind(Sessions))
})

var Sessions = {
  iD: 0,
  quizID: 0,
  numCorrect: 0,
  numIncorrect: 0,
  mostRecentResult: false,
  init: function() {
    Sessions.iD = Math.floor(Math.random() * 100000000000)
    Sessions.displayQuizSelector()
  },
  displayQuizSelector: function() {
    $('.question-display').text("Which quiz would you like to take?")
    $.ajax({
      url: '/quizzes.json',
      type: 'get'
    }).done(function(data, textStatus, jqXHR) {
      var quizzes = data.quizzes
      for (var i=0;i<quizzes.length;i++) {
        var $optionTemplate = $(".templates .choice").clone()
          $optionTemplate.attr("value",quizzes[i].quiz_id)
          $optionTemplate.text(quizzes[i].name)
          $(".choice-display").append($optionTemplate)
      }
    })
  },
  onFormSubmit: function(e) {
    e.preventDefault()
    Sessions.quizID = $('form#submission option:selected').val()
    $('.choice-display').html('')
    $('form#submission').unbind()
    QuizQuestions.getNextQuestion()
    $('.num-correct').removeClass('hidden')
    $('.num-incorrect').removeClass('hidden')
    $('form#submission').on("submit", AnswerSubmission.onFormSubmit.bind(AnswerSubmission))
  }
}

var QuizQuestions = {
  iD: 0,
  appendQuestionAndChoices: function(data, textStatus, jqXHR){
    $(".question-display").text(data.question.question)

    QuizQuestions.iD = data.question.question_id
    var choices = data.question.choices
    for (var i=0;i<choices.length;i++) {
      var $optionTemplate = $(".templates .choice").clone()
        $optionTemplate.attr("value",choices[i].choice_id)
        $optionTemplate.text(choices[i].choice)
        $(".choice-display").append($optionTemplate)
    }
  },
  displayFinalScreen: function() {
    $('form#submission').html('')
    $('.question-display').text("Quiz completed!")
  },
  getNextQuestion: function() {
    $.ajax({
      url: '/quizzes/' + Sessions.quizID + '/questions/next.json',
      type: 'get',
      data: {session_key: Sessions.iD}
    }).done(this.appendQuestionAndChoices.bind(this)).error(this.displayFinalScreen.bind(this))
  }
}

var AnswerSubmission = {
  choiceID: 0,
  onFormSubmit: function(e){
    e.preventDefault()
    AnswerSubmission.choiceID = $('form#submission option:selected').val()
    $.ajax({
      url: "/questions/" + QuizQuestions.iD + "/answers.json",
      type: 'post',
      data: {session_key: Sessions.iD, choice_id: AnswerSubmission.choiceID}
    }).done(this.updateSessions.bind(this))
  },
  updateSessions: function(data, textStatus, jqXHR) {
    $(".last-right").addClass("hidden")
    $(".last-wrong").addClass("hidden")
    Sessions.numCorrect = data.status.num_correct
    Sessions.numIncorrect = data.status.num_incorrect
    Sessions.mostRecentResult = data.status.correct
    AnswerSubmission.updateAllDisplayedValues()
  },
  updateAllDisplayedValues: function() {
    $(".choice-display").html("")
    if (Sessions.mostRecentResult) {
      $(".last-right").toggleClass("hidden")
    } else {
      $(".last-wrong").toggleClass("hidden")
    }
    $('.num-correct').text("Correct answers: " + Sessions.numCorrect)
    $('.num-incorrect').text("Incorrect answers: " + Sessions.numIncorrect)
    QuizQuestions.getNextQuestion()
  },
  listener: function() {
    $('form#submission').on("submit", this.onFormSubmit.bind(this))
  }
}
