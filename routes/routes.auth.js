const router = require('express').Router()

const { Users } = require('../models/users')

router.post('/signup', (req, res) => {
    // Will first check with firebase. Code to be added

    // Will check if User exists in DB
    Users.findOne({mobile: req.body.mobile})
        .then(user => {
            if(user === null) {
                // User not found. Create New User
                console.log('User Does not exist', req.body)
                req.body.authId = req.body.firebase_id            // TODO: Will store hashed value 
                var newUser = new Users(req.body)
                newUser.save().then(() => res.send({authId: newUser.authId}))
                    .catch(() => res.send('Could not save new User'))
            } else {
                // User Found
                console.log('User exists')
                res.send(user)
            }
        }) 
})

router.post('/info', (req, res) => {
    // Check if any field is not filled
    Users.findOne({authId: req.token})
        .then((user) => {
            if(user === null) {                   // Accidental request for an ID which doesn't exist
                res.sendStatus(405)
            }
        })
})

module.exports = router