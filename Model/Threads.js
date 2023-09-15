const mongoose = require('mongoose')



const threadSchema = mongoose.Schema(
    {
        title:
        {
            type: String
        },

        post:
        {
            type: String
        },

        createdAt:
        {
            type: Date,
            default: Date.now
        },

        comments:
            [
                {
                    user: { type: String },
                    comment: { type: String, required: true }
                }
            ],

        createdBy:
        {
            type: String

        },
        owner:
        {
            type: String

        },

    },
    {
        timestamps: true
    }
)

const Threads = mongoose.model('Threads', threadSchema)

module.exports = Threads