const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})
        if(!user) {
            throw new Error()
        }
        req.token = token //for logout
        req.user = user  //provide var to router, so it does not need to fetch user again 
        next()
    } catch (e) {
        res.status(403).send({error: 'Not logged on'})
    }

}


module.exports = auth