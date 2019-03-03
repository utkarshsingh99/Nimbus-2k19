const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organizedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams'
    },
    date: {
        type: Date
    }    
})

const Events = mongoose.model('Events', eventSchema)

module.exports = { Events }

// Removed Field in Schema
// participants: [
//     {
//         teamName: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Participants'
//         }
//     }
// ]