const router = require('express').Router()

const { Questions } = require('../models/questions')
const { quiz } = require('../models/quiz')

// ONLY FOR DEVELOPMENT

router.get('/', (req, res) => {
    quiz.find({})
        .then(quiz => {
            res.send(quiz)
        })
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
            questions.forEach((question, index) => { 
                question1 = {question: question.question, 
                            _id: question._id,
                            option1: question.option1,
                            option2: question.option2,
                            option3: question.option3,
                            option4: question.option4}
                questionsList.push(question1)
                if(index === questions.length - 1) {
                    // console.log(questions)
                    res.send(questionsList)
                }
            })
        })
})

router.post('/answers', (req, res) => {
    var correct = 0;
    var answers = req.body.answers
    answers.forEach((answer, index) => {
        Questions.findById(answer.questionId)
            .then(question => {
                if(question.answer == answer) {
                    correct++;
                }
                if(index === answers.length - 1) {
                    res.send({correct})
                }
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