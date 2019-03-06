const router = require('express').Router()
const { Events } = require('../models/events')
const { Participants } = require('../models/participants')
const { Users } = require('../models/users')

router.get('/', (req, res) => {
    Events.find({}).then(data => res.send(data))
})

router.post('/teamsinfo', (req, res) => {
    // Find all participants of the Event
    Participants.find({event: req.body.eventId}).then(participants => {
        // For Each team, fetch & display member name and roll Number
        participants.forEach((participant, pindex) => {
            participant.members.forEach((member, index) => {
                // Fetch Member from user_id
                Users.findById(member.user_id)
                    .then(user => {
                        // Replacing user_id in members array with name and rollNumber
                        if(user === null) {                     // Just basic API protection
                            res.send('Member does not exist')
                        } 
                        participant.members[index] = {name: user.name, rollNumber: user.rollNumber}
                                    
                        if(pindex === participants.length - 1 && index === participant.members.length - 1) {
                            res.send(participants)  
                        }
                    })
            }) 
        })
    }) 
})

router.post('/newteam', (req, res) => {
    
    // Save New Team in Participant Collection
    Users.findOne({authId: req.headers.token})
        .then(user => {
            if(user === null) {
                res.send('User Not Found')
            } else {
                // Add user to req.body.members
                req.body['members'] = [{user_id: user._id}]
            }
            var newteam = new Participants(req.body)
            newteam.save().then(team => {
                console.log('Team Saved')
                res.send(team)
            })
        })
    
    // Save New Team in the Events Collection
        // On Hold. Don't really think that's necessary
})

router.post('/jointeam', (req, res) => {
    Participants.findById(req.body.teamId)
        .then(team => {
            if(req.body.password === team.password) {
                // TODO: Add Member to array of the team
                Users.findOne({authId: req.headers.token})
                    .then(user => {
                        if(user) {
                            team['members'].push({user_id: user._id})         
                            res.send(200)
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