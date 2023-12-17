const mongoose = require('mongoose')
console.log("URL: ", process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'task-manager-api',
    useNewUrlParser: false,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
