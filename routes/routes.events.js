const router = require('express').Router()
const { Events } = require('../models/events')

router.get('/', (req, res) => {
    Events.find({}).then(data => res.send(data))
})

router.post('/teamsinfo', (req, res) => {
    Events.findById(req.body.eventId)
        .then(event => {
            if(event) {
                res.send(event)
            } else {
                res.send(404)           // Event Not Found
            }
        })
})

// router.post('/newteam', (req, res) => {
//     Events.findByIdAndUpdate(req.body.eventId, {$})
// })

module.exports = router