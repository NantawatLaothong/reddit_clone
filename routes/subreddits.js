const express = require('express')
const router = express.Router()
const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');

// new community page  
// localhost:7098/r/new
router.get('/new', async(req, res)=>{
  try{
    res.render('subreddit/new')
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
    res.render('submit/new', {r});
  } catch(err){
    console.log(`something went wrong in /:subreddit/new`)
  }
})


router.get('/:subreddit', async (req, res)=>{
  try {
    const {subreddit} = req.params
    const r = await Subreddit.findOne({r: subreddit}).populate('posts');
    if(r){
      res.render('subreddit/index', {posts: r.posts, subreddit});
    } else {
      res.render('subreddit/404', {subreddit})
    }
  } catch(err){
    console.log(err)
    res.send('something went wrong in GET /:subreddit')
  } 
})

router.get('/submit', async(req, res)=>{
  try{
    res.render('subreddit/submit')
  } catch(err) {
    console.log(err)
    res.send('something went wrong in GET /submit')
  }
})


// exporting using es6
module.exports = router;