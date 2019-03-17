const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    quizName: {
        type: String
    },
    organizedBy: {
        type: String
    },
    users: [
        {
            name: {
                type: String,
                required: true
            },
            rollNumber: {
                type: String,
                required: true
            },
            score: Number,
            profilePicture : String
        }
    ]
})

// TODO: Need to add fields for leaderboard scores

const quiz = mongoose.model('quiz', quizSchema)

module.exports = { quiz }
