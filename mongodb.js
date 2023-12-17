// CRUD

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb') //deconstruction

const connectionURL = process.env.MONGODB_URL
const databaseName = 'task-manager'  //whatever name of db

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Error: ', error)
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //    // _id: id,
    //     name: 'Semiramida',
    //     age: 2043
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert', error.message)
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany(
    //     [
    //         {
    //             name: 'Mirko',
    //             age: 21
    //         },
    //         {
    //             name: 'Slavko',
    //             age: 22
    //         }
    //     ], (error, result) => {
    //         if (error) {
    //             return console.log('Unable to insert', error.message)
    //         }

    //         console.log(result.ops)
    //     })

    // db.collection('tasks').insertMany(
    //     [
    //         {
    //             description: 'Ohladi pivo',
    //             completed: false
    //         },
    //         {
    //             name: 'Ohladi vino',
    //             completed: true
    //         },
    //         {
    //             name: 'Nabavi sir',
    //             completed: false
    //         }
    //     ], (error, result) => {
    //         if (error) {
    //             return console.log('Unable to insert', error.message)
    //         }

    //         console.log(result.ops)
    //     })

    // db.collection('users').findOne({_id: new ObjectID('656507e6c9b9341d38f5566d')}, (error, user) => {
    //     if(error) {
    //         return console.log('Unable to fetch', error.message)
    //     }

    //     console.log(user)

    // })

    // db.collection('users').find({age: 48}).toArray((error, users) =>{
    //     console.log('ToArray: ', users)
    // })   // find returns cursor


    // db.collection('users').find({age: 48}).count((error, count) =>{
    //     console.log('Count: ', count)
    // })   // find returns cursor


    // db.collection('tasks').findOne({_id: new ObjectID('65650392994caf3d18c15b8e')}, (error, task) => {
    //     if(error) {
    //         return console.log('Unable to fetch', error.message)
    //     }

    //     console.log(task)

    // })

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) =>{
    //     console.log('ToArray: ', tasks)
    // })   // find returns cursor

    // db.collection('tasks').updateMany(
    //     {
    //         completed: false
    //     },
    //     {
    //         $set: { completed: true }
    //     }).then((result) => {
    //         console.info('Updated count: ', result.modifiedCount)
    //     }).catch((error) => {
    //         console.log('Update Error: ', error)
    //     })

    // db.collection('users').deleteMany({ age: 48 }).then((result) => {
    //     console.info('Deleted count: ', result.deletedCount)
    // }).catch((error) => {
    //     console.log('Delete Error: ', error)
    // })

    // db.collection('tasks').deleteOne({ description: 'Ohladi pivo' }).then((result) => {
    //     console.info('Deleted count: ', result.deletedCount)
    // }).catch((error) => {
    //     console.log('Delete Error: ', error)
    // })
})