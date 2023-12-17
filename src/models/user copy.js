const mongoose = require('mongoose')
const validator = require('validator')

//mongoose middleware

// const bcrypt = require('bcryptjs')
// const myFunction = async () => {

//     const password = 'Red12345!'
//     const noOfRounds = 8
//     const hashedPassword = await bcrypt.hash(password, noOfRounds)
//     console.log(password, hashedPassword)

//     const isMatch = await bcrypt.compare(password, hashedPassword)
//     console.log
// }



const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (!(value.toLowerCase().search('password') === -1)) {
                throw Error('Do not use password as a pass word!')
            }
        }
    }
}
)

module.exports = User