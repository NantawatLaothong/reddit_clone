require('dotenv').config();
const express = require('express')
const router = express.Router()
const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// router.get('/', async(req, res)=>{
//     try{
//         res.render('users/index')
//     } catch(err){

//     }
// })

router.get('/profile', async(req, res)=>{
    try{
        const user = await User.findById(req.user._id)
        res.render('users/index', { url : req.url, user})
    } catch(err){
        console.log(err)
    }
})

// exporting using es6
module.exports = router;