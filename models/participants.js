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
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    },
    members: [
        {
            name: String,
            rollNumber: String
        }
    ]
})

const Participants = mongoose.model('Participants', partipantSchema)

module.exports = { Participants }