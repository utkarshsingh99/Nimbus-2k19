const router = require('express').Router()

const Users = require('./models/users')

router.post('/signup', (req, res) => {
    // Will first check with firebase. Code to be added

    // Will check if User exists in DB
    Users.find({firebase_id: req.body.firebase_id})
        .then(user => {
            if(user == null) {
                // User not found. Create New User
                var newUser = new Users(req.body)
                console.log(newUser)
                newUser.save().then(() => res.send('New User Saved'))
                    .catch(() => res.send('Could not save new User'))
            } else {
                // User Found
                res.send('User Already Exists!')
            }
        }) 
})



module.exports = router