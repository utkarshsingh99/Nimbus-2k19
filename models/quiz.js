const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
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
    answer: {
        type: Number,
        required: true
    }
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = { Quiz }