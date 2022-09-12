const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 3000;
const path = require('path');
const ejsMate = require('ejs-mate');
const rRouter = require('./routes/subreddits');

app.use(morgan('tiny'));
app.use(express.static(path.resolve(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.get('/', async (req, res)=>{
    res.render('home');
});

app.use('/r', rRouter);

app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`);
})