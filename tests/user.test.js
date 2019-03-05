const request = require('supertest')

const app = require('../app')

const mobile = Math.floor(Math.random()*10000000000)
const firebase_id = Math.floor(Math.random() * 100000)
var id = ""

test('Should signup a new user', async() => {
    const response = await request(app).post('/auth/signup').send({
        mobile,
        firebase_id
    })
    expect(typeof response).toBe('object')
    id = response._id
})

test('Should add info about a new user and return status code 200', async() => {
    const response = await request(app).post('/auth/info')
        .set('token', firebase_id.toString()).send({
        "name": "User" + mobile,
        "rollNumber": "MI" + `${mobile.toString().slice(0,4)}`,
        "authId": firebase_id,
        "branch": "CSE",
        "year": "2"
    })
    expect(response).toBe(200)
})

test('Should return profile of the user in JSON format', async () => {
    const response = await request(app).get('/auth/profile')
        .set('token', firebase_id)
    console.log(response)
    expect(typeof response).toBe('object')
})