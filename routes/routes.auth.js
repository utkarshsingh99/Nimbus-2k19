const router = require('express').Router()

const { Users } = require('../models/users')

router.post('/signup', (req, res) => {
    // Will first check with firebase. Code to be added

    // Will check if User exists in DB
    
    Users.findOne({ mobile: req.body.mobile })
        .then(user => {
            if(user === null) {
                // If Mobile Number doesn't exist, make a new user
                var newUser = new Users({mobile: req.body.mobile, authId: req.body.firebase_id})
                newUser.save().then(newU => res.send(newU))
                    .catch(e => res.send(e))
            } else {
                // Mobile Number exists, find it and return the entire user object
                res.send(user)
            }
        }).catch(e => {
            console.log('Couldn\'t perform the findOne function')
            res.send('Error: ', e)
        }) 
              
})

router.post('/info', (req, res) => {
    // Check if any field is not filled
    console.log(req.headers.token)
    Users.findOneAndUpdate({authId: req.headers.token}, {$set: {...req.body}})
        .then(user => {
            if(user === null) {                   // Accidental request for an ID which doesn't exist
                res.sendStatus(404)
            } else {
                res.sendStatus(200)                  
            }
        }).catch(e => res.send(e))
})

router.get('/profile', (req, res) => {
    Users.findOne({authId: req.headers.token})
        .then(user => {
            if(user) {
                res.send({
                    name: user.name,
                    rollNumber: user.rollNumber,
                    branch: user.branch,
                    year: user.year,
                    events: user.events
                 })
            } else {
                res.sendStatus(404)                 // If User not found, user = null
            }
        }).catch(e => res.sendStatus(501))          
})

module.exports = router


// In signup route, loophole: If firebase_id is changed for a new user and sent, it should not be over-written


// UNCOMMENT THIS TO TEST DATABASE CONNECTIVITY
// router.get('/sample', (req, res) => {
//     var user = new Users({ mobile: '12345', authId: '12345' })
//     user.save().then(user => res.send(user))
//         .catch(e => res.send(e))
// })