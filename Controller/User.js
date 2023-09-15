const Users = require("../Model/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendmail = require('../SendMail');
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => { //cb=callback
        cb(null, "./Uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "" + file.originalname)
    }
})

const upload = multer({
    storage: fileStorage
}).single("image")




const CreateUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err)
        } else {
            let image;
            if (req.file) {
                console.log(req.file)
                image = req.file.path.replace(/\\/g, "/")
            }
            const { password } = req.body
            const hashPassword = await bcrypt.hash(password, 10)
            const user = await Users.create({ ...req.body, password: hashPassword, image: image })
            if (!user) {
                res.json({ status: 0, message: "Failed" })
            }

            const token = await user.generateToken()
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true

            }
            res.cookie("token", token, options).json({ status: 1, message: "Login successful", user, token: token })

        }
    })
}


const UserLogin = async (req, res) => {
    const { email, password } = req.body
    const user = await Users.findOne({ email: email })
    if (!user) {
        return res.json({ status: 0, message: "User not found" })
    }
    const isMatched = await user.matchPassword(password)

    if (!isMatched) {
        return res.json({ status: 0, mesage: "Incorrect password" })
    }
    const token = user.generateToken()

    const options = {

        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true

    }

    res.cookie("token", token, options).json({ status: 1, message: "Login successful", user, token: token })

}
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const getUser = await Users.findOne({ email: email });
        if (!getUser) {
            return res.status(404).json({ message: "User Doesn't Exist" });
        }
        let token = jwt.sign({ username: getUser.username, userId: getUser._id }, process.env.SECRET, { expiresIn: "5m" })
        const link = `http://localhost:3000/reset/password/${getUser._id}/${token}`
        let content = `Hi ${getUser.username} \n Your link to reset the password \n ${link} \n This will be valid only for 5 mins. \nIf you didn't request this, please ignore this email.`
        sendmail(email, "Link to reset Password", content)
        res.json({ status: 1, mesage: `Link sent to your mail` })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const User = await Users.find()
        if (!User) {
            res.json({ status: 0, message: "User not found" })
            return
        }
        res.json({ status: 1, response: User })
    } catch (error) {
        console.log(error)
    }
}


const getSingleUser = async (req, res) => {
    const singleUser = await Users.find(req.user._id)
    if (!singleUser) {
        res.json({ status: 0, message: "Thread not found" })
        return
    }
    res.json({ status: 1, response: singleUser })

}

const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if (!user) {
            res.json({ status: 0, mesage: "USer not found0" })
        }
        res.json({ status: 1, response: user })

    } catch (error) {
    }
}

const updateUserById = async (req, res) => {

    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err)
            } else {
                let image;
                if (req.file) {
                    console.log(req.file)
                    image = req.file.path.replace(/\\/g, "/")
                }
                console.log(req.body)
                const updateUser = await Users.findByIdAndUpdate(req.params.id, req.body, image)
                if (!updateUser) {
                    res.json({ status: 0, message: "User is not updated" })
                    return
                }
                res.json({ status: 1, message: "updated" })

            }
        })
    } catch (error) {
        res.json({ message: error })
    }

}
const deleteUserbyId = async (req, res) => {
    try {
        const deleteUser = await Users.findByIdAndDelete(req.params.id)
        if (!deleteMovie) {
            res.json({ status: 0, message: "User is not deleted" })
            return
        }
        res.json({ status: 1, message: "successfully deleted" })
    } catch (error) {
        res.json({ message: error })
    }

}


const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body
    const checkUser = await Users.findOne({ email: email })
    if (!checkUser) {
        res.json({ status: 0, message: "user not found" })
        return
    }
    if (checkUser) {
        if (newPassword === confirmPassword) {
            const hashPassword = await bcrypt.hash(newPassword, 10)
            const update = await Users.updateOne({ _id: checkUser._id }, { password: hashPassword, otpVerify: false })
            if (update) {
                res.json({ status: 1, message: "Password Reset Successfully" })
            }
        } else {
            res.json({ status: 0, message: "Password not match" })
        }
    } else {
        res.json({ status: 0, message: "OTP validation Required" })
    }

}
const CreateMovie = async (req, res) => {



};



module.exports = { CreateUser, UserLogin, forgotPassword, resetPassword, getUser, getSingleUser, getUserById, deleteUserbyId, updateUserById }