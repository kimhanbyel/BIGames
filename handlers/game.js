const wss = require('./acidRain');

const acidRain = (req, res) => {
  res.render("games/acidRain/index.html", {user : req.session.user});
}

const tetris = (req, res)=>{ 
  res.render('games/tetris/index.html', {user : req.session.user})}

module.exports = {
  acidRain,
  tetris,
}