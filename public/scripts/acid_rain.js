const ws = new WebSocket("ws://localhost:3001");
const $myRoom = document.querySelector('#room');
const $myNick = document.querySelector('#myNick');
const $myMsg = document.querySelector('#myMsg');
const $chatLog = document.querySelector('#chat-log');
const $cvs = document.querySelector('#board');
$cvs.width = 890;
$cvs.height = 400;

const ctx = $cvs.getContext('2d');
ctx.font = "bold 20px Arial, sans-serif";

class Word {
  constructor(word, x, y, color){
    this.word = word;
    this.x = x;
    this.y = y;
    this.color = color;
  }
  draw(ctx){  
    ctx.fillStyle = this.color;
    ctx.fillText(this.word, this.x , this.y);
  }
  down(){
    this.y += 25;
  }
}

const words = [];

const changeColor = (word) => {
  words.map(w => {
    if(w.word === word)
      w.color = "#000";
  })
}

const clearBoard = () => {
  ctx.clearRect(0, 0, 1000, 500);
}


setInterval(() => {
  clearBoard();
  words.map(w=>{
    w.draw(ctx);
    w.down();
  })
  if(words.length >=15)
    words.shift();
}, 1000);

const myMsgSend = () =>{
  const myMsg = {room : $myRoom.value, nick : $myNick.value, msg : $myMsg.value};
  ws.send(JSON.stringify(myMsg));
  $myMsg.value="";
}

const receiveMsg = (e) =>{
  const msg = JSON.parse(e.data)
//    console.log(msg);
  if(msg.room){
    changeColor(msg.msg);    
    $chatLog.innerHTML += `${msg.nick} : ${msg.msg}\n` ;
    $chatLog.scrollTop = $chatLog.scrollHeight;
  }
  else
    words.push(new Word(msg.word, Math.floor(Math.random()*800), 20, "#ddd"));

}
ws.onmessage = receiveMsg;

document.addEventListener('keyup', (e)=>{
  if(e.key == "Enter") {
//    changeColor($myMsg.value);
    myMsgSend();
  }
})

