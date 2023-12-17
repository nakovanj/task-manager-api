const mongoose = require('mongoose')
console.log("URL: ", process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'task-manager-api',
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
