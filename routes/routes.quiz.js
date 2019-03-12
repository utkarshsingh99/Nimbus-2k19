const router = require('express').Router()
var _ = require('lodash');

const { Questions } = require('../models/questions')
const { quiz } = require('../models/quiz')
const { Users } = require('../models/users')

// ONLY FOR DEVELOPMENT

router.get('/', (req, res) => {
    quiz.find({})
        .then(quiz => {
            res.send(quiz)
        })
})

router.get('/questions', (req, res) => {
    Questions.find({})
        .then(questions => res.send(questions))
})

router.post('/postquiz', (req, res) => {
    var quiz1 = new quiz(req.body)
    quiz1.save().then(ret => res.send(ret))
})

// router.get('/', (req, res) => {
//     Quiz.find({})
//         .then(quizzes => {
//             res.send(quizzes)
//         })
// })

// {
//     question: 'Some question',
//     option1: 'dfgfg',
//     option2: 'opgdf',
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
// DELETE ABOVE CODE WHEN GOING INTO PRODUCTION

router.post('/questions', (req, res) => {
    // Code to check if user has already played the quiz needs to be added
    let questionsList = []
    Questions.find({quizId: req.body.quizId})                               // All questions with the particular quiz event
        .then(questions => {
            var randomNum = generateRandomNumbers(questions.length)
            console.log(randomNum)
            for(var i = 0; i < 10; i ++) {
                var question = _.pick(questions[randomNum[i]], ["question", "option1", "option2", "option3", "option4", "_id"])
                questionsList.push(question)
            }
            res.send(questionsList)
        })
})

router.post('/answers', (req, res) => {
    var correct = 0;
    var answers = req.body.answers
    Users.findOne({authId: req.headers.token})
        .then(user => {
            answers.forEach((answer, index) => {
                Questions.findById(answer.questionId)
                .then(question => {
                    if(question.answer == answer) {
                        correct++;
                    }
                    if(index === answers.length - 1) {
                        console.log(question.quizId)
                        quiz.findOneAndUpdate({_id: question.quizId}, {$push: {users: {name: user.name, rollNumber: user.rollNumber, score: correct}}})
                            .then(() => res.send({ correct }))
                    }
                })
            })
        })
})

module.exports = router

// {
//     "_id": {
//         "$oid": "5c7ec33efb6fc072012e8aef"
//     },
//     "quizName": "App Team",
//         "organizedBy": "App Team NITH"
// }

function generateRandomNumbers(length) {
    var arr = []
    while (arr.length < 11) {
        var r = Math.floor(Math.random() * length) + 1
        if (arr.indexOf(r) === -1) 
            arr.push(r)
    }
    return arr
}

// {
//    quizId 
// }
router.post('/leaderboard', (req, res) => {
    quiz.findById(quizId)
        .then(quizInfo => {
            console.log(quizInfo)
            res.send(quizInfo.users)
        })
})