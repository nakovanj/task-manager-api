const express = require('express')
require('./db/mongoose')
const jwt = require('jsonwebtoken')

const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT


app.use(express.json()) //automatically parse json to object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is running on port: ', port)
})
