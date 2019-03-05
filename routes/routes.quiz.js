const router = require('express').Router()

const { Questions } = require('../models/questions')

// ONLY FOR DEVELOPMENT
router.get('/', (req, res) => {
    Quiz.find({})
        .then(questions => {
            res.send(questions)
        })
})

// {
//     question: 'Some question',
//     option1: 'dfgfg',
//     option2: 'opgdf',
//     option3: 'vbfadbs',
//     option4: 'sdfd',
//     answer: 4
// }

router.post('/postquestions', (req, res) => {
    console.log('Post request for Questions')
    var doc = new Questions(req.body)
    doc.save().then(doc => {
        res.send(doc)
    })
})
// DELETE ABOVE CODE WHEN GOING INTO PRODUCTION

router.post('/questions', (req, res) => {
    
})

module.exports = router