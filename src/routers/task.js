const express = require('express')
require('../db/mongoose')
const Task = require('../models/task')
const auth = require('../middleware/auth')
//new router
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,   //ES6 spread operator
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400)
        res.send(e)

    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400)
    //     res.send(error)

    // })
})


router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //    const task = await Task.findById(_id)
        const task = await Task.findOne({ _id: _id, owner: req.user.id })
        if (!task) {
            console.info('#1')
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//GET /tasks
//GET /tasks?completed=false/true
// pagination: 
// GET /task?limit=nn&skip=mm
// sort
// GET /sortBy=createdAt_asc/createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        console.log('Sort: ', sort)
    }
    try {
        // alternative solutions:
        // 1:
        //  const tasks = await Task.find({ owner: req.user._id})
        // res.send(tasks)

        // 2:
        //        await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidOp = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOp) {
        return res.status(400).send({ 'Error': 'Invalid updates!' })
    }
    try {
        // const _id = req.params.id
        // const task = await Task.findByIdAndUpdate(_id, req.body,
        //     {
        //         new: true,
        //         runValidators: true, 
        //     }) 


        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // const task = await Task.findById(req.params.id)
        if (!task) {
            console.info('#2')

            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        // if (!task) {
        //     return res.status(404).send()
        // }
        res.status(202).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        // const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            console.info('#3')

            return res.status(404).send()
        }
        await task.remove()

        res.status(202).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router