const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

// Import Routes and Keys
const authRoutes = require('./routes/routes.auth')
const eventRoutes = require('./routes/routes.events')
const keys = require('./keys')

// Import DB Models
const {Users} = require('./models/users')
const {Events} = require('./models/events')
const {Participants} = require('./models/participants')
const {Teams} = require('./models/teams')

mongoose.connect(keys.mongo.url, {useNewUrlParser: true, useCreateIndex: true}, () => console.log('DB Connected'))

var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/events', eventRoutes)


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
                        if(index === team.events.length - 1) {
                            res.send(team)
                        }
                    })
            })
        }).catch(e => res.send('Club Not Found'))
})

const port = process.env.PORT || 3000

app.listen(port, '100.112.162.158', () => console.log('Port Up'))