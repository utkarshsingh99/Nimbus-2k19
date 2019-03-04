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
    members: [
        {
            name: {
                type: String
            },
            rollNumber: {
                type: String
            },
            user_id: {
                type: String
            }
        }
    ]
})

const Participants = mongoose.model('Participants', partipantSchema)

module.exports = { Participants }