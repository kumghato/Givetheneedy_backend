const express = require('express')
const { CreateThread, getAllThread, getThreadById, postComment, commentPost, getAllThreadByOWner } = require('../Controller/Threads')
const authentication = require('../Middleware/Auth')
const Threads = require('../Model/Threads')

const routes = express.Router()

routes.route("/create/comment/:id").post(authentication, commentPost)
// routes.route("/get/comment/:id").get(getComment)

routes.route("/create/thread").post(authentication, CreateThread)
routes.route('/get/all/thread').get(getAllThread)
routes.route('/get/all/thread/owner').get(authentication, getAllThreadByOWner)
routes.route('/get/thread/:id').get(getThreadById)


module.exports = routes