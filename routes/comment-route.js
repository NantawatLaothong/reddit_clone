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
const subreddit = require('../models/subreddit');

// s3 configuration
const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY
const s3Buceket = process.env.S3_BUCKET_REGION

const s3 = new aws.S3({
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
    region: s3Buceket
})

const upload = multer({
    storage: multerS3({
        // s3 
        s3: s3,
        bucket: "dev-app-clone-994214",
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, Date.now()+ "__" + file.originalname);
          }
    })
});

isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      // req.flash('error', 'You must be singed in first!')
      return res.redirect('/users/login');
  }
  // call next if the user is authenticated
  next();
}

isAuthortized = async (req, res, next) => {
  const {id} = req.params
  // find the user that 
  const user = await User.findById(req.params.id);
  if(!user.equals(req.user._id)){
      req.flash('error', "You do not have the permission!")
      return res.redirect(`/`)
    }
    next();
}

isAuthor = async (req, res, next) => {
  const {id} = req.params;
  // find the user that 
  const post = await Post.findById(id);
  if(!post.user.equals(req.user._id)){
      req.flash('error', "You do not have the permission!")
      return res.redirect(`/`)
    }
    next();
}

// c/:id posting comment to comment
router.post('/:id', isLoggedIn, async(req, res)=>{
    try{
        const {id} = req.params
        const user = await User.findById(req.user._id);
        const comment = await Comment.findById(id).populate({path: 'post', options: {populate: 'subreddit'}})
        const replyComment = new Comment({
            body: req.body.commentText
        });
        const post = comment.post
        replyComment.user = user
        user.comments.push(replyComment);
        comment.comments.push(replyComment);
        await replyComment.save();
        await user.save();
        await comment.save();
        // routing to homepage
        res.redirect(`/r/${post.subreddit.r}/${post._id}`);
    } catch(err) {
        res.send('something went wront in POST /c/:id')
    }
})

module.exports = router;