const jwt = require("jsonwebtoken")
const User = require("../Model/User")
const req = require("express/lib/request")

const authentication = async (req, res, next) => {
    try {
        // const { token } = req.cookies

        if (req.headers.authorization) {
            let decode = jwt.verify(req.headers.authorization, process.env.SECRET)
            if (decode) {
                req.user = await User.findById(decode._id)
                next()
            } else {
                res.json({ message: "Unauthorized" })
            }
        } else {
            res.json({ message: "Unauthorized" })
        }


    } catch (error) {
        res.json(error)
    }
}

module.exports = authentication

     // const decoded = await jwt.verify(token, process.env.SECRET)
        // if (decoded) {
        //     req.user = await User.findById(decoded._id)
        //     next()
        // }    