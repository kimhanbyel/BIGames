const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({port : 3001});

const data1 = ["김","박","신","이", "가", "조", "정", "지", "장"];
const data2 = ["한","희","동","정", "성", "원", "강", "혜", "다", "준", "선", "휘", "세", "진", "태", '재'];
const data3 = ["별","진","민","찬", "필", "재", "빈", "찬", "빈", "혁", "호", "성", "빈", "영", "균", '현'];

const randomWord = () => {
  let a = Math.floor(Math.random()*data1.length);
  let b = Math.floor(Math.random()*data2.length);
  let c = Math.floor(Math.random()*data3.length);
  return data1[a] + data2[b] + data3[c];
}

global.randWord = '';

setInterval(() => {
  global.randWord = { word : randomWord()};
}, 1000);

wss.on("connection", ws =>{
  console.log(`연결되었습니다.`);
  console.log(wss.clients.size);

  setInterval(() => {
    //console.log(global.randWord);
    ws.send(JSON.stringify(global.randWord));
  }, 1000);
  
  ws.on("message", data =>{
    ws.color = JSON.parse(data).color;
    for(client of wss.clients){
      client.send(data.toString());
    }
  });
});  

module.exports = wss;
// 1. 단어를 입력하고 엔터
// 2. words 단어가 존재하는지 확인
// 3. 존재하면 5번으로 가
// 4. 존재하지 않으면 1번으로 가
// 5. 서버로 내가 입력한 단어를 보내
// 6. 서버가 받은 단어를 모든 클라이언트로 보내
// 7. 각 클라이언트들은 words 단어가 존재하는지 확인
// 8. 색을 바꾸면 끝.