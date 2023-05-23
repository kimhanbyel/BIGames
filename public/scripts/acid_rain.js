'use strict'
import Word from './word.js';
import ScoreBoard from './scoreBoard.js';
import TimeBar from './timeBar.js';
import { BASIC_FONT_STYLE, COUNT_DOWN_FONT_STYLE } from './global_variable.js';

const ws = new WebSocket("ws://10.94.121.10:3001");
const $myNick = document.querySelector('#myNick');
const $myMsg = document.querySelector('#myMsg');
const $chatLog = document.querySelector('#chat-log');
const $cvs = document.querySelector('#board');
const $readyBtn = document.querySelector('#ready');
const $startBtn = document.querySelector('#start');

$cvs.width = 890+235;
$cvs.height = 430;

const ctx = $cvs.getContext('2d');
ctx.font = BASIC_FONT_STYLE;
const sb = new ScoreBoard(915, 10, 200, 380);
const tb = new TimeBar(10, $cvs.height-30, $cvs.width-20, 20, "pink");

const words = [];
window.color = undefined;

const init = () => {
  tb.init($cvs.width-20);
  window.isBangJang = false;
  window.gameIsReady = false;
  window.gameIsNotStart = true;
  window.myScore = 0;
  window.timer = null;
  $readyBtn.style.display = 'inline-block';
};

init();


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

const gameStart = (timeout) => {
  const d = tb.w * 100 / timeout;
  window.timer = setInterval(() => {
    clearBoard();
    sb.draw(ctx);
    tb.w -= d;
    tb.draw(ctx);
    words.map(w=>{
      w.draw(ctx);
    })
    if(words.length >=15)
      words.shift();
  }, 100);

  window.WordDownTimer = setInterval(() => {
    words.map(w=>{
      w.down();
    })
  }, 1000)
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
    window.isBangJang = true;
  },

  'common' : (msg) => {
    $chatLog.innerHTML += `${msg.nick.substr(0, 3)} : ${msg.msg.substr(0,15)}\n` ;
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
  'countDown' : (msg) => {
    let cnt = 5;
    const countDownTimer = setInterval(() => {
      clearBoard();
      sb.draw(ctx);
      ctx.font = COUNT_DOWN_FONT_STYLE;
      ctx.fillStyle = '#ddd';
      ctx.fillText(`${cnt}` , 890/2  , 430/2);
      cnt--;
      if(cnt < 0) {
        clearInterval(countDownTimer);
        ctx.font = BASIC_FONT_STYLE;
        if(window.isBangJang)
          myMsgSend("start", "시작");
      }
    }, 1000);
  },

  'end' : (msg) => {
    clearInterval(window.timer);
    clearInterval(window.WordDownTimer);
    sb.sort();
    sb.draw(ctx);
    sb.init();
    init();
  },

  'ready' : (msg) => {
    window.myScore = msg.score;
    sb.players.push(msg);
    sb.draw(ctx);
  },

  'start' : (msg) => {
    if(window.gameIsNotStart){
      gameStart(msg.timeout);
      window.gameIsNotStart = false;
    }
  },

  'word' : (msg) => {
    words.push(new Word(msg.word, Math.floor(Math.random()*800), 20, "#ddd"));
  },
}

const receiveMsg = (e) => {
  const msg = JSON.parse(e.data)
  console.log(msg);
  functionByMsgCode[msg.code](msg);
}

ws.onmessage = receiveMsg;

window.gameReady = () => {
  $readyBtn.style.display = 'none';
  clearBoard();
  words.length = 0;
  window.myScore = 0;
  myMsgSend("ready", "준비");
}

window.bangJangStart = () => {
  $startBtn.style.display = 'none';
  myMsgSend('countDown', '카운트다운');
}

document.addEventListener('keyup', (e)=>{
  if(e.key == "Enter") {
    if($myMsg.value.trim().length > 0)
      myMsgSend();
  }
})

