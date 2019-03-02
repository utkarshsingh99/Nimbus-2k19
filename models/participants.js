const mongoose = require('mongoose')

const partipantSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    },
    members: {
        type: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
            }
        ]
    }
})

const Participants = mongoose.model('Participants', partipantSchema)

module.exports = { Participants }