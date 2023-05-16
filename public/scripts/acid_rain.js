import Word from './word.js';
import ScoreBoard from './scoreBoard.js';

window.gameIsReady = false;
window.gameIsNotStart = true;

const ws = new WebSocket("ws://localhost:3001");
const $myColor = document.querySelector('#color');
const $myNick = document.querySelector('#myNick');
const $myMsg = document.querySelector('#myMsg');
const $chatLog = document.querySelector('#chat-log');
const $cvs = document.querySelector('#board');
$cvs.width = 890+235;
$cvs.height = 400;

const ctx = $cvs.getContext('2d');
ctx.font = "bold 20px Arial, sans-serif";
const sb = new ScoreBoard(915, 10, 200, 380);

sb.draw(ctx);

const words = [];

const changeColor = (word, color) => {
  words.map(w => {
    if(w.word === word && w.color === '#ddd')
      w.color = color;
  })
}

const clearBoard = () => {
  ctx.clearRect(0, 0, $cvs.width, $cvs.height);
}

window.gameReady = () => {
  window.gameIsReady = true;
  myMsgSend("준비");
}

const gameStart = () => {
  setInterval(() => {
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

const myMsgSend = (msg = $myMsg.value ) =>{
  const myMsg = {color : $myColor.value, nick : $myNick.value, msg : msg , ready : window.gameIsReady};
  ws.send(JSON.stringify(myMsg));
  $myMsg.value="";
}

const receiveMsg = (e) =>{
  const msg = JSON.parse(e.data)
//    console.log(msg);
  if(msg.msg){
    changeColor(msg.msg, msg.color);    
    $chatLog.innerHTML += `${msg.nick} : ${msg.msg}\n` ;
    $chatLog.scrollTop = $chatLog.scrollHeight;
  }
  else{
    words.push(new Word(msg.word, Math.floor(Math.random()*800), 20, "#ddd"));
    if(window.gameIsNotStart){
      gameStart();
      window.gameIsNotStart = false;
    }
  }

}
ws.onmessage = receiveMsg;

document.addEventListener('keyup', (e)=>{
  if(e.key == "Enter") {
    myMsgSend();
  }
})

