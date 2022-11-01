require('dotenv').config();
const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const express = require('express');
const router = express.Router()


// search for subreddit
router.get('/search', async(req, res)=>{
    try{
        const {term} = req.query
        const query = await Subreddit.find({r: {"$regex": term} });
        res.json(query);
    } catch(err){
        res.send(err)
    }
});

// exporting using es6
module.exports = router;