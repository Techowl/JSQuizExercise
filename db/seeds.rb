# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

quiz1 = Quiz.create(name: "Dev Bootcamp Questions")

question1 = quiz1.questions.create(question: "Who is your favorite teacher?")
question1.choices.create(choice: "Matt", is_correct: false)
question1.choices.create(choice: "Strand", is_correct: false)
question1.choices.create(choice: "Jeffrey", is_correct: false)
question1.choices.create(choice: "None of the Above", is_correct: true)

question2 = quiz1.questions.create(question: "Is Javascript awesome?")
question2.choices.create(choice: "Yes", is_correct: true)
question2.choices.create(choice: "No", is_correct: false)

question3 = quiz1.questions.create(question: "Who is your least favorite teacher?")
question3.choices.create(choice: "Matt", is_correct: false)
question3.choices.create(choice: "Strand", is_correct: false)
question3.choices.create(choice: "Jeffrey", is_correct: true)
question3.choices.create(choice: "None of the Above", is_correct: false)

question4 = quiz1.questions.create(question: "Which framework is taught at DBC?")
question4.choices.create(choice: "Node.js", is_correct: false)
question4.choices.create(choice: "Ruby on Rails", is_correct: true)
question4.choices.create(choice: "Django", is_correct: false)


quiz2 = Quiz.create(name: "Javascript Questions")

question1 = quiz2.questions.create(question: "How strange is prototypical inheritance?")
question1.choices.create(choice: "Quite strange", is_correct: false)
question1.choices.create(choice: "Very freaking strange", is_correct: true)

