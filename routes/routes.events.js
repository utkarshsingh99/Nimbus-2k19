const router = require('express').Router()
const { Events } = require('../models/events')
const { Participants } = require('../models/participants')
const { Users } = require('../models/users')

router.get('/', (req, res) => {
    Events.find({}).then(data => res.send(data))
})

router.post('/teamsinfo', (req, res) => {
    Events.findById(req.body.eventId)
        .then(event => {
            if(event) {
                // Find all participants of the Event
                Participants.find({}).then(participants => {
                    // console.log(participants)
                    participants.forEach((participant, index) => {
                        participant.members.forEach((member, index) =>{
                            console.log(member)
                            Users.findById(member.user_id)
                                .then(user => {
                                    console.log(user.name)
                                    if(user === null) {
                                        res.send('Member does not exist')
                                    } 
                                    participant.members[index] = {name: user.name, rollNumber: user.rollNumber}
                                    
                                    if(index === participant.members.length - 1) {
                                        res.send(participants)  
                                    }
                                })
                        }) 
                    })
                }) 
            } else {
                res.send(404)           // Event Not Found
            }
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