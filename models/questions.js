const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    quizId: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    option4: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    answer: {
        type: Number,
        required: true
    }
})

const Questions = mongoose.model('Questions', questionSchema)

module.exports = { Questions }