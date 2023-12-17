const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            trim: true,
            minlength: 2,
            required: true

        },
        completed: {
            type: Boolean,
            required: false,
            default: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'    // reference to User model
        }
    },
    { //schema options
        timestamps: true
    })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task