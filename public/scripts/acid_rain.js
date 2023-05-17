import Word from './word.js';
import ScoreBoard from './scoreBoard.js';

window.gameIsReady = false;
window.gameIsNotStart = true;
window.myScore = 0;

const ws = new WebSocket("ws://localhost:3001");
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
  const myMsg = { color : null, 
                  nick : $myNick.value, 
                  msg : msg , 
                  ready : window.gameIsReady,
                  score : window.myScore,
                }; 
  ws.send(JSON.stringify(myMsg));
  $myMsg.value="";
}

const receiveMsg = (e) =>{
  const msg = JSON.parse(e.data)
//    console.log(msg);
  if(msg.msg){
    console.log(msg);
    const foundWord = findWord(msg.msg);
    if(foundWord)
      foundWord.color = msg.color;
    if(foundWord && (msg.nick === $myNick.value)){
      window.myScore += 10;
      myMsgSend('딩동뎅');
    }  

    $chatLog.innerHTML += `${msg.nick} : ${msg.msg}\n` ;
    $chatLog.scrollTop = $chatLog.scrollHeight;

    if(!msg.ready) return;
    
    const alreadyExistPlayer = sb.players.filter(p=>p.nick === msg.nick);
    if(alreadyExistPlayer.length === 0){
      sb.players.push(msg);
      sb.draw(ctx);
      return;
    }
    alreadyExistPlayer[0].score = msg.score;
    sb.draw(ctx);
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
    if($myMsg.value.trim().length > 0)
      myMsgSend();
  }
})

