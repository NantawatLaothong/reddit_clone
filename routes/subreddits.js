const express = require('express')
const router = express.Router()

// new community page  
router.get('/new', async(req, res)=>{
  try{
    res.render('subreddit/new')
  } catch(err){
    console.log(err);
  }
})

router.get('/:subreddit', async (req, res)=>{
  try {
    const {subreddit} = req.params
    res.render('subreddit/index', {subreddit});
  } catch(err){
    console.log(err);
  } 
})

router.get('/submit', async(req, res)=>{
  try{
    res.render('subreddit/submit')
  } catch(err) {
    console.log(err);
  }
})


// exporting using es6
module.exports = router;