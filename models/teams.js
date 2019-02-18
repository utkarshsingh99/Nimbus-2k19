const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    convener: {
        type: String
    }
})

const Teams = mongoose.model('Teams', teamSchema)

module.exports = { Teams }