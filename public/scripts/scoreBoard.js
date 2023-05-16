class ScoreBoard {
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w; 
    this.h = h;
    this.players = [];
  }
  draw(ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    this.players.map((p, i)=>{
      ctx.fillStyle = p.color;
      ctx.fillText(`${p.nick} : ${p.score}` , this.x+10 , this.y+30+i*20);
    })
  }
}

export default ScoreBoard;