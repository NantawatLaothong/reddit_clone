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

// /apis/r/:subreddit/:page
router.get('/r/:subreddit/:page', async(req, res)=>{
    try{ 
        const {subreddit, page} = req.params
        if (page == null){
            page = 0
        }
        // nested populate
        const r = await Subreddit.findOne({r: subreddit}).populate({path: 'posts', populate: [{path:'subreddit', select: 'r'}, {path:'user', select:'username'}], 
        options: {sort: {'createdAt': -1},
            limit: 5,
                skip: 5 * page
    }});
        // console.log(req.originalUrl);
        const posts = r.posts
        res.send(posts);
    }catch(err) {
        res.send('API /more does not work properly')
    }
})

router.get('/news/:page', async(req, res)=>{
    try {

        const {page} = req.params;
        if (page == null){
            page = 0
        }
        // find posts for user
        console.log(req.query);
        if(req.query.username){
            const user = await User.findOne({'username': req.query.username});
            // const stringOfFollowedCommunities = user.followedCommunites;
            // console.log(user.followedCommunities)
            if(user){
                console.log(user.followedCommunites)
                const r = await Subreddit.find({r: {$in: user.followedCommunites}}).limit(5);
                const posts = await Post.find({subreddit: {$in: r}}).populate({path: 'subreddit', select: 'r' }).populate('meta').populate({path: 'user', select: 'username'}).sort({ createdAt: -1 }).limit(5).skip(5*page);
                console.log(5 * page);
                res.send(posts);
            }
        } else {
      // find posts for home
        const posts = await Post.find().populate({path: 'subreddit', select: 'r'}).populate('comments').populate({path:'user', select: 'username'}).sort({createdAt: -1}).limit(5).skip(5*page);
        console.log(5 * page);
        res.send(posts);
        }
    } catch(err) {
        res.send('API /news does not work preperly')
    }
})

// exporting using es6
module.exports = router;