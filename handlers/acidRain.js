const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({port : 3001});
const TIMEOUT = 10*1000;

const bangJangInit = () => {
  wss.isNotDecideBangJang = true;
  wss.bangJang = null;  
}

const init = () => {
  wss.isNotGeneratingWord = true;
  wss.readyCnt = 0;
  wss.players = [];
  bangJangInit();
}

init();

const randomColor = () => {
  const HEX = '789ABCDEF';
  let color = '#';
  for(let i=0; i<3; i++)
    color += HEX[Math.floor(Math.random() * HEX.length)];
  return color;
}

const data1 = ["김","박","신","이", "가", "조", "정", "지", "장"];
const data2 = ["한","희","동","정", "성", "원", "강", "혜", "다", "준", "선", "휘", "세", "진", "태", '재'];
const data3 = ["별","진","민","찬", "필", "재", "빈", "찬", "빈", "혁", "호", "성", "빈", "영", "균", '현'];

const randomWord = () => {
  let a = Math.floor(Math.random()*data1.length);
  let b = Math.floor(Math.random()*data2.length);
  let c = Math.floor(Math.random()*data3.length);
  return data1[a] + data2[b] + data3[c];
}

const isExistNick = nick => wss.players.filter(p => p.nick == nick);

const bangJangPick = () => {
  if(wss.readyCnt >= wss.clients.size && wss.isNotDecideBangJang){
    const bangJangNum = Math.floor(Math.random() * wss.clients.size);
    let cnt = 0;
    for(client of wss.clients){
      if(cnt === bangJangNum){
        wss.bangJang = client;
        client.send(JSON.stringify({code : 'bangJang'}));
        break;
      }
      cnt++;
    }
    wss.isNotDecideBangJang = false;
  }    
}


const functionByMsgCode = {
  'ready' : (wss, ws, data) => {
    data.score = 0;

    if(isExistNick(data.nick).length > 0){
      data.players = wss.players;
      return;
    }

    wss.players.push({nick : data.nick, color : data.color, score : data.score, })
    data.players = wss.players;
    wss.readyCnt++;   

    bangJangPick();
  },
  
  'start' : (wss, ws, data) => { 
    wss.timer = setInterval(() => {
      const randWord = { code : 'word', word : randomWord() };
      for(client of wss.clients)
        client.send(JSON.stringify(randWord));
    }, 1000);
    
    setTimeout(() => {
      for(client of wss.clients)
        client.send(JSON.stringify({code : 'end', msg : '끝'}));

      clearInterval(wss.timer);
      init();
    }, TIMEOUT);
    
    data.timeout = TIMEOUT;
  },

  'bangJang'  : (wss, ws, data) => {},
  'common'    : (wss, ws, data) => {},
  'color'     : (wss, ws, data) => {},
  'correct'   : (wss, ws, data) => {},
  'countDown' : (wss, ws, data) => {},
  'word'      : (wss, ws, data) => {},
}

wss.on("connection", (ws) =>{
  console.log(`연결되었습니다.`);
  console.log(wss.clients.size);
  ws.send(JSON.stringify({code : 'color', color : randomColor()}))

  ws.on("close", () => {
    console.log("연결이 끊어졌습니다.");
    if(wss.bangJang == ws){
      console.log('방장이 나갔습니다.');
      bangJangInit();
      bangJangPick();
    }

//    wss.players = wss.players.filter(p => { if(p.ws != ws) return p; })
//    wss.players.map(p => p.send(JSON.stringify({code : 'ready', players : wss.players})));
  
    if(wss.clients.size) return;  

    clearInterval(wss.timer);
    init();

  }) 

  ws.on("message", data =>{
    const dataJson = JSON.parse(data);
    
    functionByMsgCode[dataJson.code](wss, ws, dataJson);

    console.log(dataJson);

    for(client of wss.clients){
      client.send(JSON.stringify(dataJson));
    }
  });
});  

module.exports = wss;

// ******단어 색을 바꾸는 과정*****
// 1. 단어를 입력하고 엔터
// 2. words 단어가 존재하는지 확인
// 3. 존재하면 5번으로 가
// 4. 존재하지 않으면 1번으로 가
// 5. 서버로 내가 입력한 단어를 보내
// 6. 서버가 받은 단어를 모든 클라이언트로 보내
// 7. 각 클라이언트들은 words 단어가 존재하는지 확인
// 8. 색을 바꾸면 끝.


// *****2명의 사용자의 게임이 동시에 시작되도록 하는 과정*****
// 1. 2명의 모두 준비가 되어 있는지 확인
//    1) 클라이언트에서 준비버튼을 클릭하면 서버로 정보를 송신
//    2) 2명에게 준비 신호를 받았는지 확인
//    3) 모두 확인되면 2번으로, 그렇지 않으면 대기
// 2. 서버에서 클라이언트로 단어를 송신




