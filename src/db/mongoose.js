const mongoose = require('mongoose')
//console.log("URL: ", process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
