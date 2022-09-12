const express = require('express')
const router = express.Router()

router.get('/:subreddit', async (req, res)=>{
  try {
    const {subreddit} = req.params
    res.render('subreddit/index', {subreddit});
  } catch(err){

  } 
})
// exporting using es6
module.exports = router;