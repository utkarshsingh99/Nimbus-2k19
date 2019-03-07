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
        participants.map((participant) => {
            return participant.members.map((member) => {
                // Fetch Member from user_id
                return Users.findById(member.user_id)
                    .then(user => {
                        // Replacing user_id in members array with name and rollNumber
                        if(user === null) {                     // Just basic API protection
                            res.send('Member does not exist')
                        } 
                        participant.members[index] = {name: user.name, rollNumber: user.rollNumber}

                        if(index === participant.members.length - 1) {
                            console.log(participant.members)
                        }
                                    
                        // if(pindex === participants.length - 1 && index === participant.members.length - 1) {
                        //     res.send(participants)  
                        // }
                        // if (pindex === participants.length - 1 && index === participant.members.length - 1) {
                        //     res.send(participants)
                        // }
                    })
            }) 
        }).then(participants => {
            console.log(participants)
            res.send(participants)
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
                // Add user to req.body.members, since currently s/he is only member in team
                req.body['members'] = [{user_id: user._id}]
            }
            var newteam = new Participants(req.body)
            newteam.save().then(team => {
                res.send(team)
            })
        })
})

router.post('/jointeam', (req, res) => {
    // Finds the teamId
    Participants.findById(req.body.teamId)
        .then(team => {
            if(req.body.password === team.password) {                   // Checks if password matches with the stored team password
                // TODO: Add Member to array of the team
                Users.findOne({authId: req.headers.token})
                    .then(user => {
                        if(user) {
                            if(team.members.indexOf(user._id) === -1) {             // To check if user doesn't already exist in team
                                team['members'].push({user_id: user._id})         
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