const express = require('express')
const router = express.Router()
const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
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


router.post('/:subreddit', async(req, res)=>{
  try {
    // find the subreddit
    const r = req.params.subreddit;
    const subreddit = await Subreddit.findOne({r:r});
    const user = await User.findById(req.user._id);
    // if found do these
    if(subreddit){
      const {title, body} = req.body;
      const post = new Post({
        title,
        body
      });
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
router.get('/:subreddit/new', async(req, res)=>{
  try{
    const r = req.params.subreddit;
    res.render('submit/new', {r, url: req.url});
  } catch(err){
    console.log(`something went wrong in /:subreddit/new`)
  }
})


router.get('/:subreddit', async (req, res)=>{
  try {
    const {subreddit} = req.params
    const r = await Subreddit.findOne({r: subreddit}).populate('posts');
    // console.log(req.originalUrl);
    if(r){
      res.render('subreddit/index', {posts: r.posts, subreddit, url: req.originalUrl});
    } else {
      res.render('subreddit/404', {subreddit})
    }
  } catch(err){
    console.log(err)
    res.send('something went wrong in GET /:subreddit')
  } 
})

router.get('/:subreddit/:id', async(req, res)=>{
  try {
    const {subreddit, id} = req.params
    // const r = await Subreddit.findOne({r: subreddit}).populate({path: 'posts', match: {"_id": id}});
    const post = await Post.findOne({_id:id}).populate('comments');
    const comments = await Comment.find({post: post}).populate('user');
    // console.log(r);
    // const post = await r.find({"post._id": id});
    // res.send('hi')
    // console.log(post);
    // if(r){
      // console.log(post);
      // res.send('ht')
      res.render('subreddit/single', {post: post, subreddit, comments, url: req.originalUrl});
    // } else {
      // res.render('subreddit/404', {subreddit})
    // }
  } catch(err){
    res.send('something went wrong in Get /:subreddit/:id')
  }
});

router.get('/submit', async(req, res)=>{
  try{
    res.render('subreddit/submit', {url: req.url})
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