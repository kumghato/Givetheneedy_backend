const express = require('express')
const { CreateUser, UserLogin, forgotPassword, resetPassword, getUser, getUserById, getSingleUser, updateUserById, deleteUserbyId } = require('../Controller/User');
const authentication = require('../Middleware/Auth');


const routes = express.Router()

routes.route("/forgot/password").post(forgotPassword);
routes.route("/reset/password/:id/:token").put(resetPassword);
routes.route("/create/user").post(CreateUser)
routes.route("/user/login").post(UserLogin)
routes.route("/get/user").get(authentication, getUser)
routes.route("/get/single/user").get(authentication, getSingleUser)
routes.route("/get/user/:id").get(authentication, getUserById)
routes.route("/update/user/:id").put(authentication, updateUserById)
routes.route("/delete/user/:id").delete(authentication, deleteUserbyId)

module.exports = routes