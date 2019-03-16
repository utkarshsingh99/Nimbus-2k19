const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')

// Import Routes and Keys
const authRoutes = require('./routes/routes.auth')
const eventRoutes = require('./routes/routes.events')
const quizRoutes = require('./routes/routes.quiz')
const keys = require('./keys')

// Import DB Models
const { Users } = require('./models/users')
const { Events } = require('./models/events')
const { Participants } = require('./models/participants')
const { Teams } = require('./models/teams')
const { Quiz } = require('./models/quiz')

mongoose.connect(keys.mongo.url, { useNewUrlParser: true, useCreateIndex: true }, () => console.log('DB Connected'))

var app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/events', eventRoutes)
app.use('/quiz', quizRoutes)


app.get('/', (req, res) => {
    res.send('Site Working')
})

app.get('/departments', (req, res) => {
    Teams.find({}).then(teams => {
        res.send(teams)
    })
})

app.post('/departments', (req, res) => {
    Teams.findById(req.body.clubId)
        .then(team => {
            // Replace EventIDs with actual event details
            var noOfEvents = team.events.length
            team.events.forEach((eventId, index) => {
                Events.findById(eventId)
                    .then(event => {
                        console.log(event)
                        team.events[index] = event
                        if (index === team.events.length - 1) {
                            res.send(team)
                        }
                    })
            })
        }).catch(e => res.send('Club Not Found'))
})

// Below Code is for build phase ONLY
// app.get('/participants', (req, res) => {
//     Participants.find({})
//         .then(participants => {
//             res.send(participants)
//         })
// })

// app.get('/users', (req, res) => {
//     Users.find({})
//         .then(users => {
//             res.send(users)
//         })
// })
// Delete Above Code before launching

module.exports = app;