const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    quizName: {
        type: String
    },
    organizedBy: {
        type: String
    }
})

// TODO: Need to add fields for leaderboard scores

const quiz = mongoose.model('quiz', quizSchema)

module.exports = { quiz }