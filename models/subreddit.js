const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

// create a Schema for User 
const subredditSchema = new Schema({
    r: {
        type: String,
        required: true,
    },
    iconURL: {
        url: String,
        filename: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean
    },
    adult_content: {
        type: Boolean
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    followers: [
        String
    ]
}, { timestamps: true });
// This will add Username nad password to the schema and some methods to use for authentication 
// username will be unique
// https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/22117222#overview

module.exports = mongoose.model('Subreddit', subredditSchema);