const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your Username.']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password.']
    },
    score: {
        type: Number,
    },
    attempt: {
        type: Number,
    },
    finished: {
        type: Array,
    }
})

const User = mongoose.model('users', UserSchema)

module.exports = User
