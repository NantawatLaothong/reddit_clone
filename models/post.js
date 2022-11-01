// https://stackoverflow.com/questions/12147686/storing-upvotes-downvotes-in-mongodb
const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
// location and key
const postSchema = new mongoose.Schema({
    title: String,
    subreddit: {
        type: Schema.Types.ObjectId,
        ref: 'Subreddit'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    meta: {
        tags: [
            {type: String}
        ],
        upvotes: [
            String
        ],
        down_votes: [
            String
        ],
    },
    body: {
        type: String
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },
    ],
    imageURL: {
        url: String,
        filename: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);