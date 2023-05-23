import { BASIC_FONT_STYLE } from './global_variable.js';

class ScoreBoard {
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w; 
    this.h = h;
    this.players = [];
  }
  draw(ctx){
    ctx.font = BASIC_FONT_STYLE;
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    this.players.map((p, i)=>{
      ctx.fillStyle = p.color;
      ctx.fillText(`${p.nick.substr(0,3)} : ${p.score}` , this.x+10 , this.y+30+i*20);
    })
  }
  init(){
    this.players = [];
  }
  sort(){
    console.log(this.players);
    this.players.sort((a, b) => { return b.score - a.score;});
  }
}

export default ScoreBoard;