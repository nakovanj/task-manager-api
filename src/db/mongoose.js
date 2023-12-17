const mongoose = require('mongoose')

const mongoDbUrl = process.env.MONGODB_URL + 'task-manager-api'
mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
