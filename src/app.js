const express = require('express')
require('./db/mongoose')
const jwt = require('jsonwebtoken')

const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()

app.use(express.json()) //automatically parse json to object
app.use(userRouter)
app.use(taskRouter)

//no listen due to supertest
module.exports = app