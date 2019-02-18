const router = require('express').Router()
const { Events } = require('../models/events')

router.get('/', (req, res) => {
    Events.find({}).then(data => res.send(data))
})

module.exports = router