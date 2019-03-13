const router = require('express').Router()
const { Events } = require('../models/events')
const { Participants } = require('../models/participants')
const { Users } = require('../models/users')

router.get('/', (req, res) => {
    Events.find({}).then(data => res.send(data))
})

router.post('/teamsinfo', (req, res) => {
    // Find all participants of the Event
    Participants.find({eventId: req.body.eventId}).then(participants => {
        // For Each team, fetch & display member name and roll Number
        res.send(participants)
    }) 
})

router.post('/newteam', (req, res) => {
    // Save New Team in Participant Collection
    Users.findOne({authId: req.headers.token})
        .then(user => {
            if(user === null) {
                res.send('User Not Found')
            } else {
                // Add user to req.body.members, since currently s/he is only member in team
                req.body['members'] = [{name: user.name, rollNumber: user.rollNumber}]
            }
            Participants.find({eventId: req.body.eventId, members: {name: user.name, rollNumber: user.rollNumber}})
                .then(participant => {
                    if(!participant) {
                        var newteam = new Participants(req.body)
                        newteam.save().then(team => {
                            res.send(team)
                        })
                    }
                })
        })
})

router.post('/jointeam', (req, res) => {
    // Finds the teamId
    Participants.findById(req.body.teamId)
        .then(team => {
            console.log(req.body.password, team.password)
            if(req.body.password === team.password) {                   // Checks if password matches with the stored team password
                // TODO: Add Member to array of the team
                Users.findOne({authId: req.headers.token})
                    .then(user => {
                        if(user) {
                            if(!team.members.find(member => member.rollNumber === user.rollNumber)) {             // To check if user doesn't already exist in team
                                team['members'].push({name: user.name, rollNumber: user.rollNumber})
                                res.send(200)
                            } else {
                                res.send('User already exists in team')
                            }
                        } else {
                            res.send('User not authorized')
                        }
                    })
            } else {
                res.send('Passwords do not match')
            }
        })
})

module.exports = router