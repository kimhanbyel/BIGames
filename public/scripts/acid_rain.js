import Word from './word.js';
import ScoreBoard from './scoreBoard.js';

window.gameIsReady = false;
window.gameIsNotStart = true;
window.myScore = 0;
window.myColor = '';
window.timer = null;

const ws = new WebSocket("ws://localhost:3001");
const $myNick = document.querySelector('#myNick');
const $myMsg = document.querySelector('#myMsg');
const $chatLog = document.querySelector('#chat-log');
const $cvs = document.querySelector('#board');
const $readyBtn = document.querySelector('#ready');
const $startBtn = document.querySelector('#start');

$cvs.width = 890+235;
$cvs.height = 400;

const ctx = $cvs.getContext('2d');
ctx.font = "bold 20px Arial, sans-serif";
const sb = new ScoreBoard(915, 10, 200, 380);

sb.draw(ctx);

const words = [];

const findWord = (word) => {
  let foundWord = null;
  words.map(w =>{
    if(w.word === word && w.color === '#ddd')
      foundWord = w;
  })
  return foundWord;
}

const clearBoard = () => {
  ctx.clearRect(0, 0, $cvs.width, $cvs.height);
}

const gameStart = () => {
  window.timer = setInterval(() => {
    clearBoard();
    sb.draw(ctx);
    words.map(w=>{
      w.draw(ctx);
      w.down();
    })
    if(words.length >=15)
      words.shift();
  }, 1000);
}

const myMsgSend = (code = 'common', msg = $myMsg.value ) =>{
  const myMsg = { 
                  code : code,
                  color : window.myColor, 
                  nick : $myNick.value, 
                  msg : msg , 
                  score : window.myScore,
                }; 
  ws.send(JSON.stringify(myMsg));
  $myMsg.value="";
}

const functionByMsgCode = {
  'bangJang' : (msg) => {
    $startBtn.type = 'button';
    $startBtn.value = "Start";
    $startBtn.style = 'cursor:pointer;';
  },

  'common' : (msg) => {
    $chatLog.innerHTML += `${msg.nick} : ${msg.msg}\n` ;
    $chatLog.scrollTop = $chatLog.scrollHeight;
    const foundWord = findWord(msg.msg);
    if(foundWord)
      foundWord.color = msg.color;
    if(foundWord && (msg.nick === $myNick.value)){
      window.myScore += 10;
      myMsgSend('correct', msg.msg);
    }  
  },

  'color' : (msg) => {
    window.myColor = msg.color;  
  },

  'correct' : (msg) => {
    const alreadyExistPlayer = sb.players.filter(p=>p.nick === msg.nick);
    if(alreadyExistPlayer){
      alreadyExistPlayer[0].score = msg.score;
      sb.draw(ctx);
    }
  },

  'ready' : (msg) => {
    sb.players.push(msg);
    sb.draw(ctx);
  },

  'start' : (msg) => {
    if(window.gameIsNotStart){
      gameStart();
      window.gameIsNotStart = false;
    }
  },

  'word' : (msg) => {
    words.push(new Word(msg.word, Math.floor(Math.random()*800), 20, "#ddd"));
  },
}

const receiveMsg = (e) =>{
  const msg = JSON.parse(e.data)
  console.log(msg);
  functionByMsgCode[msg.code](msg);
}

ws.onmessage = receiveMsg;

window.gameReady = () => {
  $readyBtn.style.display = 'none';
  myMsgSend("ready", "준비");
}

window.bangJangStart = () => {
  $startBtn.style.display = 'none';
  myMsgSend('start', '시작');
}

document.addEventListener('keyup', (e)=>{
  if(e.key == "Enter") {
    if($myMsg.value.trim().length > 0)
      myMsgSend();
  }
})

