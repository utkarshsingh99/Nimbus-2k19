const router = require('express').Router()
var _ = require('lodash')
var cron = require('node-cron')

const { Questions } = require('../models/questions')
const { quiz } = require('../models/quiz')
const { Users } = require('../models/users')

// CRON Scheduling to delete Users for the day
cron.schedule('0 3 * * *', () => {
    quiz.find({})
        .then((quizzes) => {               // Get all the documents in the collection
            quizzes.forEach((element, index) => {
                console.log(element._id)
                var today = new Date().getDate() - 1
                quiz.findByIdAndUpdate(element._id, {$push: {pastUsers: {date: today, users: element.users}}})
                    .then(updatedQuiz => {            
                        quiz.findByIdAndUpdate(element._id, { $set: { users: [] } })
                        .then(final => console.log('Updated Quiz: ', final))
                    })
            })
        })
})

router.post('/postquiz', (req, res) => {
    var quiz1 = new quiz(req.body)
    quiz1.save().then(ret => res.send(ret))
})

router.get('/', (req, res) => {
    quiz.find({})
        .then(quizzes => {
            res.send(quizzes)
        })
})

router.get('/questions', (req, res) => {
    Questions.find({})
        .then(questions => res.send(questions))
})

// {
//     question: 'Some question',
//     option1: 'dfgfg',
//     option2: 'opgdf',String
//     option3: 'vbfadbs',
//     option4: 'sdfd',
//     answer: 4
// }
router.post('/postquestions', (req, res) => {
    console.log(req.body)
    var doc = new Questions(req.body)
    console.log(doc)
    doc.save().then(doc => {
        res.send('OK')
    })
})

router.post('/questions', (req, res) => {
    // Code to check if user has already played the quiz needs to be added
    let questionsList = []
    console.log('Request Made')
    Questions.find({quizId: req.body.quizId})                               // All questions with the particular quiz event
        .then(questions => {
            if(questions.length <= 10) {                 // Last deadliest bug which made the server hang mysteriously
                console.log([])
                res.send([])
            } else {
                var randomNum = generateRandomNumbers(questions.length)
                console.log('Random Numbers: ', randomNum)
                for(var i = 0; i < 10; i ++) {
                    var question = _.pick(questions[randomNum[i]], ["question", "option1", "option2", "option3", "option4", "_id", "picture"])
                    questionsList.push(question) 
                }
                quiz.findOne({ _id: req.body.quizId })
                    .then(quiz => {
                        // console.log(quiz)
                        Users.findOne({authId: req.headers.token})
                            .then(user => {
                                // Check if user exists in users array of quiz
                                var member = quiz.users.find(member => member.rollNumber === user.rollNumber)
                                if (member === undefined) {
                                    // User has not played quiz before 
                                    console.log('An array of questions like: ', questionsList[0])
                                    res.send(questionsList)
                                } else {
                                    res.send('User has already played')
                                }
                            })
                    })
                }
        })
})

router.post('/answers', (req, res) => {
    var correct = 0, counter = 0;
    var answers = req.body.answers
    Users.findOne({authId: req.headers.token})
        .then(user => {
            answers.forEach((answer, index) => {
                Questions.findById(answer.questionId)
                    .then(question => {
                        if(question.answer == answer.answer) {
                            correct += 10 + answer.remainingTime
                        }
                        counter++;
                        console.log('counter:', counter)
                        if(counter === 9) {
                            quiz.findOne({_id: req.body.quizId})
                                .then(foundQuiz => {
                                    // Check if user exists in users array of quiz
                                    var member = foundQuiz.users.find(member => member.rollNumber === user.rollNumber)
                                    if(member === undefined) {
                                        // User has not played quiz before
                                        console.log('User not found in quiz array')
                                        quiz.findOneAndUpdate({_id: question.quizId}, 
                                                            {$push: 
                                                                {users: {name: user.name, 
                                                                        rollNumber: user.rollNumber, 
                                                                        score: correct,
                                                                        profilePicture : user.profilePicture}
                                                                }
                                                            }).then((quiz) => res.send({ correct }))
                                    } else {
                                        res.send('User has already played')
                                    }
                                })
                        }
                    })
            })
        })
})

// {
//    quizId
// }
router.post('/leaderboard', (req, res) => {
    quiz.findById(req.body.quizId)
        .then(quizInfo => {
            console.log(quizInfo)
            res.send(quizInfo.users)
        })
})

module.exports = router

function generateRandomNumbers(length) {
    var arr = []
    while (arr.length <= 10) {
        var r = Math.floor(Math.random() * length) + 1
        if (arr.indexOf(r) === -1)
            arr.push(r)
    }
    return arr
}
