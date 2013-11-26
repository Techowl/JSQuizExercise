$(document).ready(function() {
///////////////////////
$.get('/quizzes.json', function(data){
  var quizName = data.quizzes[0].name
  $('.container').append($('h2.question').text(quizName))
})

var seshKey = new Date().getTime()

$.get('/quizzes/1/questions/next.json', { session_key: seshKey }, function(data){
  
  console.log('q d:', data.question)
  console.log('q d:', data.question.choices[0])
  console.log('q d:', data.question.question)
  console.log('q d:', data.serialize())
})







// var quiz = {

// }

// function showQuestion() {
//   // var make a variable for the Question html to put on screen
//   // listen to event (on doc ready). to fire this action
//   // action being .append said Question html to html body

// }

// $.ajax({
//   url: 
//   type: 
// }).done(function(data, status){

// })

// var $headerTemplate = $("#header")
// var $headerElement = $($headerTemplate.text())
// $headerElement.text("Hi, Mom!");
// $('.container').append($headerElement);



















////////////////////////
})
