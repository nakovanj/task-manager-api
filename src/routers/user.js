const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')

require('../db/mongoose')
const auth = require('../middleware/auth')
const User = require('../models/user')
const {sendWelcomeEmail, sendDeleteEmail} = require('../emails/account')

//new router
const router = new express.Router()

// config multer
const upload = multer({
//    dest: 'avatars',  sad je dostupno u ruti
    limits: {
        fileSize: 1048576
    },
    fileFilter(req, file, cb) {

        //if(!file.originalname.endsWith('.pdf')){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be picture document'))
        }
        cb(undefined, true)
        // cb(undefined, false)  silently reject

    }


})

router.get('/test', async (req, res) => {
    res.send('This is from my other router')
})

router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()

        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })  //shorthand sintax for user: user, token: token
    } catch (e) {
        console.log('Save error: ', e)
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400)
    //     res.send(error)

    // })
})

// auth mw is in the middle 
//router.get('/users', auth, async (req, res) => {
//user is authenticated, but shall not see other user's data
//so route is changed from /users -> /users/me
router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)

})

router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})



// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOp = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })

//     if (!isValidOp) {
//         return res.status(400).send({ 'error': 'Invalid updates!' })
//     }
//     try {
//         const user = await User.findById(req.params.id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         updates.forEach((update) => {
//             user[update] = req.body[update]
//         })

//         await user.save()

//         // findByIdAndUpdate skips mongoose, so pre Schema does not work
//         // const user = await User.findByIdAndUpdate(_id, req.body,
//         //     {
//         //         new: true,
//         //         runValidators: true,
//         //     }) 
//         // if (!user) {
//         //     return res.status(404).send()
//         // }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOp = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOp) {
        return res.status(400).send({ 'error': 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.delete('/users/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const user = await User.findByIdAndDelete(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.status(202).send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.delete('/users/me', auth, async (req, res) => {

    try {
         await req.user.remove()
        sendDeleteEmail(req.user.email, req.user.name)
        res.status(202).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        // not mongoose's function - possible to create
        // own functions only of schema is explicit
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
//        const retUs = user.getPublicProfile()
        res.send({ user, token }) 
    } catch (e) {
       // console.log("users login error:::: ")
        res.status(400).send({ error: e.toString() })
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // remove current token from collection
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ error: e.toString() })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        // remove current token from collection
        req.user.tokens = req.user.tokens.filter((tk) => {
            return tk.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ error: e.toString() })
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  //  req.user.avatar = req.file.buffer
  const bufferModified = await sharp(req.file.buffer)
                            .resize({width:256, height:256}).png().toBuffer()
    req.user.avatar = bufferModified
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(403).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
   try{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
} catch(e) {
    res.status(500).send({ error: e.toString() })
}})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('Nema usera ili user nema avatar')
        }
        
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(406).send({ error: e.toString() })
    }
} )

module.exports = router