
const Threads = require('../Model/Threads')
const Users = require('../Model/User');

const CreateThread = async (req, res) => {

    const user = req.user._id;

    const createNewThread = await Threads.create({ ...req.body, createdBy: user, owner: req.user.username })
    if (!createNewThread) {
        res.json({ status: 0, message: 'Cannot create' })

    }
    res.json({ status: 1, message: 'Your query has been posted successfully', createNewThread, user })

}

const getAllThread = async (req, res) => {
    const getThread = await Threads.find()

    if (!getThread) {
        res.json({ status: 0, message: 'Thread not found' })
    } else {
        res.json({ status: 1, message: 'Thread found', response: getThread })
    }
}
const getAllThreadByOWner = async (req, res) => {
    const getThread = await Threads.find({ createdBy: req.user._id })

    if (!getThread) {
        res.json({ status: 0, message: 'Thread not found' })
    } else {
        res.json({ status: 1, message: 'Thread found', response: getThread })
    }
}

const getThreadById = async (req, res) => {
    const singleThread = await Threads.findById(req.params.id)
    if (!singleThread) {
        res.json({ status: 0, message: "Thread not found" })
        return
    }
    res.json({ status: 1, response: singleThread })

}

// const postComment = async (req, res) => {
//     const findThread = await threads.findById(req.params.id)
//     if (!findThread) {
//         res.json({ status: 0, message: "Thread not found" })
//         return
//     } else {
//         const comment = {
//             comment: req.body.comment,
//             postedBy: req.params.id
//         }
//         const createComment = await threads.findByIdAndUpdate(req.params.id, {
//             $push: { comments: comment }
//         }, {
//             new: true
//         })
//         if (!createComment) {
//             res.json({ status: 0, message: "Cannot Post" })
//         } else {
//             res.json({ status: 1, message: "Comment posted" })
//         }

//     }
// }

const commentPost = async (req, res) => {
    const { id } = req.params
    const post = await Threads.findById(id)
    post.comments.push({
        user: req.user.username,
        comment: req.body.comment
    })
    const updatedThread = await Threads.findByIdAndUpdate(id, post, { new: true })
    res.json(updatedThread)
}


module.exports = { CreateThread, getAllThread, getThreadById, commentPost, getAllThreadByOWner }