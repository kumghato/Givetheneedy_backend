const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    // post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    image: { type: String }

})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.SECRET)
}

const Users = mongoose.model('Users', userSchema)

module.exports = Users