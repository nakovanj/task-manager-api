const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,   // db must be empty
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer  //binary buffer
    }
}, { 
    //schema options
    timestamps: true
})

// virtual property - not stored in DB, for mongoose needs
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    console.log('findByCredentials', email, password)
    if (!user) {
        throw new Error('Unable to login - email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login - pass')
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
 //cannot be => function as it needs to bind 'this'
 const user = this
 const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)   
 user.tokens = user.tokens.concat({ token: token})
 await user.save()
 
 return token
}

//must be called toJSON
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar  //too big to return as json

    return userObject   
}
// encrypts pass before saving to db
userSchema.pre('save', async function (next) {
    const user = this    // this = document being saved
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    return next()   // next must be called on the end!
})

//Delete task when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User