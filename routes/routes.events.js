const router = require('express').Router()
const { Events } = require('../models/events')
const { Participants } = require('../models/participants')

router.get('/', (req, res) => {
    Events.find({}).then(data => res.send(data))
})

router.post('/teamsinfo', (req, res) => {
    Events.findById(req.body.eventId)
        .then(event => {
            if(event) {
                // Find all participants of the Event
                Participants.find({event: req.body.eventId}).then(participants => {
                    event.members = participants                        // Add them to the members array
                }) 
                console.log(event)
                res.send(event)
            } else {
                res.send(404)           // Event Not Found
            }
        })
})

router.post('/newteam', (req, res) => {
    
    // Save New Team in Participant Collection
    var newteam = new Participants(req.body)
    newteam.save().then(team => console.log('Team Saved: ', team))

    // Save New Team in the Events Collection
        // On Hold. Don't really think that's necessary
})

router.post('/jointeam', (req, res) => {
    Participants.findById(req.body.teamId)
        .then(team => {
            if(req.body.password === team.password) {
                // TODO: Add Member to array of the team
                res.send(200)
            } else {
                res.send(501)
            }
        })
})

module.exports = router