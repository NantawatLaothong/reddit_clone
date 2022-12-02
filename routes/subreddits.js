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


// new community page  
// localhost:7098/r/new
router.get('/new', async(req, res)=>{
  try{
    res.render('subreddit/new', {url: req.url})
  } catch(err){
    console.log(err)
    res.send('something went wrong in GET /new')
  }
})


router.post('/:subreddit', upload.single('image'), async(req, res)=>{
  try {
    // find the subreddit
    const r = req.params.subreddit;
    const subreddit = await Subreddit.findOne({r:r});
    const user = await User.findById(req.user._id);
    // if found do these
    if(subreddit){
      const {title, body, file} = req.body;
      const post = new Post({
        title,
      });
      if(req.file){
        post.imageURL.url = req.file.location,
        post.imageURL.filename = req.file.key
      } else {
        post.body = req.body.body
      }
      user.posts.push(post)
      subreddit.posts.push(post)
      post.user = user; 
      post.subreddit = subreddit;
      await user.save();
      await subreddit.save();
      await post.save();
      res.redirect(`/r/${r}`)
    } else {
      // if the subreddit not found redirect to homepage
      res.redirect(`r/${r}`);
    }
  } catch(err) {
    console.log(err)
    res.redirect('/')
  }
})
// router
router.get('/:subreddit/new', isLoggedIn, async(req, res)=>{
  try{
    const r = req.params.subreddit;
    res.render('submit/new', {r: r, url: req.url});
  } catch(err){
    console.log(`something went wrong in /:subreddit/new`)
  }
})

router.get('/:subreddit/follow', isLoggedIn, async(req, res)=>{
  try{
    const {subreddit} = req.params
    if(req.user){
      const user = await User.findById(req.user._id);
      const r = await Subreddit.findOne({r: subreddit});
      console.log('found shit')
      r.followers.push(user.username)
      user.followedCommunites.push(subreddit)
      // console.log('follow successfully')
      await user.save()
      await r.save()
    }
    res.redirect(`/r/${subreddit}`);
  } catch(err){
    console.log(`somegthing went wrong in /:subbreddit/follow`);
  }
});

router.get('/:subreddit/leave', isLoggedIn, async(req, res)=>{
  try{
    const {subreddit} = req.params
    if(req.user){
      const user = await User.findById(req.user._id);
      const r = await Subreddit.findOne({r: subreddit});
      r.followers.pull(user.username)
      user.followedCommunites.pull(subreddit)
      // console.log('follow successfully')
      await user.save()
      await r.save()
    }
    res.redirect(`/r/${subreddit}`);
  } catch(err){
    console.log(`somegthing went wrong in /:subbreddit/follow`);
  }
});

// 


router.get('/:subreddit', async (req, res)=>{
  try {
    const {subreddit} = req.params
    const r = await Subreddit.findOne({r: subreddit}).populate({path: 'posts', options: { populate: {path: 'user'}, sort: {'createdAt': -1}, limit: 5}});
    // console.log(req.originalUrl);
    const posts = r.posts
    if(r){
      res.render('subreddit/index', {posts, r, subreddit, url: req.originalUrl});
    } else {
      res.render('subreddit/404', {subreddit})
    }
  } catch(err){
    console.log(err)
    res.send('something went wrong in GET /:subreddit')
  } 
})

router.put('/:subreddit', upload.single('subreddit-icon'), async(req, res)=>{
  try {
    // find the subreddit
    const {subreddit} = req.params;
    const r = await Subreddit.findOne({r:subreddit});
    console.log(subreddit)
    console.log(r)
    const user = await User.findById(req.user._id);
    // if found do these
    // res.send('success')
    if(r.creator.equals(req.user._id)){
      console.log('yep')
      const editedR = await Subreddit.findOneAndUpdate({r: subreddit}, {
        description: req.body.description,

      });
      if(req.file){
          r.iconURL.url = req.file.location,
          r.iconURL.filename = req.file.key
      }
      await r.save() 
      await editedR.save()
      res.redirect(`/r/${subreddit}`)
      
    } else {
      console.log("Nope")
      // if the subreddit not found redirect to homepage
      res.redirect(`r/${subreddit}`);
    }
  } catch(err) {
    console.log(err)
    res.redirect('/')
  }
})

router.put('/:subreddit/:id', isLoggedIn, isAuthor, upload.single('image'), async(req, res)=>{
  try{
    const {subreddit, id} = req.params;
    const {title, body, file} = req.body;
    console.log(req.body);
    const post = await Post.findByIdAndUpdate({_id: id}, {
      title,
      body
    });
    console.log(post);        
    post.title = title;
    console.log(post.title)
    if(req.file){
      post.imageURL.url = req.file.location,
      post.imageURL.filename = req.file.key
    } 
    // else {
    //   post.body = req.body.body
    // }
    await post.save();
    res.redirect(`/r/${subreddit}/${id}`);
  } catch(err) {
    res.send(`Something went wrong in Put /:subreddit/:id`)
  }
})

router.get('/:subreddit/:id', async(req, res)=>{
  try {
    const {subreddit, id} = req.params
    // const r = await Subreddit.findOne({r: subreddit}).populate({path: 'posts', match: {"_id": id}});
    const post = await Post.findOne({_id:id}).populate({path: 'comments', options:{ populate:'user'} }).populate('user');
    const comments = await Comment.find({post: post}).populate('user').populate({path:'comments', options:{ populate:'user'}});
    const url = '/' + req.originalUrl.split('/')[1] +  '/' +req.originalUrl.split('/')[2]
    // console.log(r);
    // const post = await r.find({"post._id": id});
    // res.send('hi')
    // console.log(post);
    // if(r){
      // console.log(post);
      // res.send('ht')
      console.log(url);
      res.render('subreddit/single', {post: post, subreddit, comments, url});
    // } else {
      // res.render('subreddit/404', {subreddit})
    // }
  } catch(err){
    res.send('something went wrong in Get /:subreddit/:id')
  }
});

// Bookmarking a post
router.get('/:subreddit/:id/bookmark', isLoggedIn, async(req, res)=>{
  try {
    const {subreddit, id} = req.params
    // const r = await Subreddit.findOne({r: subreddit}).populate({path: 'posts', match: {"_id": id}});
    const post = await Post.findOne({_id:id});
    const user = await User.findById(req.user._id);
    user.bookmarked_posts.push(post._id);
    await user.save();
    req.flash('success', 'Post bookmarked')
      res.redirect('back');
  } catch(err){
    res.send('something went wrong in Get /:subreddit/:id/bookmark')
  }
});



router.get('/:subreddit/:id/edit', async(req, res)=>{
  try {
    const url = '/' + req.originalUrl.split('/')[1] +  '/' +req.originalUrl.split('/')[2]
    const {subreddit, id} = req.params;
    const post = await Post.findById(id)
    res.render('submit/edit', {post, subreddit, url})
  } catch(err){ 
    res.send('something went wrong in GET /:subreddit/:id/edit')
  }
})

// unbookmark
router.get('/:subreddit/:id/unbookmark', isLoggedIn, async(req, res)=>{
  try {
    const {subreddit, id} = req.params
    // const r = await Subreddit.findOne({r: subreddit}).populate({path: 'posts', match: {"_id": id}});
    const post = await Post.findOne({_id:id});
    const user = await User.findById(req.user._id);
    user.bookmarked_posts.pull(post._id);
    await user.save();
    req.flash('success', 'Post unbookmarked')
      res.redirect('back');
  } catch(err){
    res.send('something went wrong in Get /:subreddit/:id/bookmark')
  }
});

// await Subreddit.find({r: {$in: user.followedCommunites}});
// upvote and downvote
router.get('/:subreddit/:id/upvote', isLoggedIn, async(req, res)=>{
  try{
    const { subreddit, id } = req.params;
    const user = await User.findById(req.user._id);
    const post = await Post.findOne({_id:id});
  if (user.upvotes.includes(id)){
      console.log('already added')
      res.redirect(`/r/${subreddit}/${id}`)
    } else if(user.down_votes.includes(id)){
      // remove the downvote and add to the upvote
      user.down_votes.pull(id);
      post.meta.down_votes.pull(req.user._id);
      user.upvotes.push(id);
      post.meta.upvotes.push(req.user._id)
      await user.save();
      await post.save();
      console.log('downvote is being replaced by upvote')
      res.redirect(`/r/${subreddit}/${id}`)
    } else {
      // add the upvore
      user.upvotes.push(id);
      post.meta.upvotes.push(req.user._id)
      await user.save();
      await post.save();
      console.log('upvote added successfully');
      res.redirect(`/r/${subreddit}/${id}`)
    }
  }catch(err){
    console.log(err)
    res.send(err);
  }
})

router.get('/:subreddit/:id/downvote', isLoggedIn, async(req, res)=>{
  try{
    const { subreddit, id } = req.params;
    const user = await User.findById(req.user._id);
    const post = await Post.findOne({_id:id});
  if (user.down_votes.includes(id)){
      console.log('already added')
      res.redirect(`/r/${subreddit}/${id}`)
    } else if(user.upvotes.includes(id)){
      // remove the upvotes and add to the downvote
      user.upvotes.pull(id);
      post.meta.upvotes.pull(req.user._id);
      user.down_votes.push(id);
      post.meta.down_votes.push(req.user._id)
      await user.save();
      await post.save();
      console.log('upvote is being replaced by downvote')
      res.redirect(`/r/${subreddit}/${id}`)
    } else {
      // add the downvote
      user.down_votes.push(id);
      post.meta.down_votes.push(req.user._id)
      await user.save();
      await post.save();
      console.log('dowvote added successfully');
      res.redirect(`/r/${subreddit}/${id}`)
    }
  }catch(err){
    res.send('err')
  }
})

router.get('/submit', async(req, res)=>{
  try{
    res.render('subreddit/submit', {url: req.url, r: a})
  } catch(err) {
    console.log(err)
    res.send('something went wrong in GET /submit')
  }
})

router.post('/:subreddit/:id/comment', async(req, res)=>{
  try{
    const {subreddit, id} = req.params
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id);
    const comment = new Comment({
      body: req.body.commentText
    })
    comment.post = post;
    comment.user = user;
    post.comments.push(comment);
    user.comments.push(comment);
    await user.save();
    await post.save();
    await comment.save();
    res.redirect(`/r/${subreddit}/${id}`);
  }
  catch(err) {
    console.log(err)
    res.send('something went wrong in POST r/subreddit/id/comment')
  }
})
// exporting using es6
module.exports = router;