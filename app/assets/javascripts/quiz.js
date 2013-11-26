var Sessions = {
  dataToSend: {session_key: 0},
  init: function() {
    Sessions.dataToSend.session_key = Math.floor(Math.random() * 100000000000)
    $.ajax({
      url: '/',
      type: 'get',
      data: Sessions.dataToSend
    })
  }
}

var QuizQuestions = {
  getNextQuestion: function() {
    $.ajax({
      url: '/quizzes/1/questions/next.json',
      type: 'get',
      data: Sessions.dataToSend
    }).done(function(data, textStatus, jqXHR){
      debugger
      // var $template = $(".templates .question").clone()
      // $template.append(data.question.question)
      // $(".test").append($template)
      $(".question-display").append(data.question.question)
    })
  }
}

$(document).ready(function() {
  Sessions.init()
  QuizQuestions.getNextQuestion()
})
