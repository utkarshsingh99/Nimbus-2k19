const router = require('express').Router()

router.get('/signup', (req, res) => {
    res.send('Check: Signup Route working')
})

module.exports = router