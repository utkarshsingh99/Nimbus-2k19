const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    participants: [
        {
            teamName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Participants'
            }
        }
    ]
})

const Events = mongoose.model('Events', eventSchema)

module.exports = { Events }