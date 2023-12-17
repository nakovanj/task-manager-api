const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'task-manager-api',
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
