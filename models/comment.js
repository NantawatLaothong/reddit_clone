// https://stackoverflow.com/questions/12147686/storing-upvotes-downvotes-in-mongodb
const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
const Post = require('./post');
// location and key

const commentSchema = new mongoose.Schema({
    title: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String
    }
    ,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);