const express = require('express')
const router = express.Router()

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

// router

router.get('/:subreddit', async (req, res)=>{
  try {
    const {subreddit} = req.params
    res.render('subreddit/index', {subreddit});
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