const express = require('express');
const session = require('express-session');
const sessionConfig = require('./config/session');
const nunjucks = require('nunjucks');
const authRouter = require('./routes/authRouter');
const gameRouter = require('./routes/gameRouter');
const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
})

app.use('/static',express.static('public'));
app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res)=>{res.render('index.html', {user : req.session.user});});
app.use('/auth', authRouter);
app.use('/games', gameRouter);

app.listen(3000);