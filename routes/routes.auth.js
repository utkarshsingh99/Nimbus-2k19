const router = require('express').Router()

const { Users } = require('../models/users')

router.post('/signup', (req, res) => {
    // Will first check with firebase. Code to be added
    console.log('Sign Up request made')
    // Will check if User exists in DB
    
    Users.findOne({ mobile: req.body.mobile })
        .then(user => {
            console.log('FindOne function')
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

router.get('/sample', (req, res) => {
    var user = new Users({ mobile: '12345', authId: '12345'})
    user.save().then(user => res.send(user))
        .catch(e => res.send(e))
})

router.post('/info', (req, res) => {
    // Check if any field is not filled
    console.log(req.token)
    Users.findOne({authId: req.token})
        .then((user) => {
            if(user === null) {                   // Accidental request for an ID which doesn't exist
                res.sendStatus(405)
            } else {
                console.log(user)
                user = req.body;
                console.log(user);
                user.save();
            }
        })
})

module.exports = router

// Users.findOneAndUpdate({ mobile: req.body.mobile }, { $set: { mobile: req.body.mobile, authId: req.body.firebase_id } })
//     .then((user) => {
//         if (user === null) {
//             res.send(301)               // A User with the specified mobile number does not exist
//         } else {
//             console.log(user)

//         }
//         res.send(user)
//     }).catch((e) => res.send(e)) 


// In signup route, loophole: If firebase_id is changed for a new user and sent, it should not be over-written