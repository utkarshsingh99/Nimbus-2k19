const mongoose = require('mongoose')
const express = require('express')

const authRoutes = require('./routes/auth')
const Users = require('./models/users')
const keys = require('./keys')

mongoose.connect(keys.mongo.url, {useNewUrlParser: true, useCreateIndex: true}, () => console.log('DB Connected'))

var app = express()

app.use('/auth', authRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => console.log('Port Up'))