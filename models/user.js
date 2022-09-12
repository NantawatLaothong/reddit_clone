const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// create a Schema for User 
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    arts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Art'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    DOB: {
        day: Number,
        month: String,
        year: Number
    },
    Bio: {
        text: {
            type: String
        }, 
        profileImage: {
                url: String,
                filename: String,
        }
    },
    profession: [{
        type: String
    }],
    country: {
        type: String
    },
    
}, { timestamps: true });
// This will add Username nad password to the schema and some methods to use for authentication 
// username will be unique
userSchema.plugin(passportLocalMongoose);

// https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/22117222#overview

module.exports = mongoose.model('User', userSchema);