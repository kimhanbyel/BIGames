class ScoreBoard {
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w; 
    this.h = h;
  }
  draw(ctx){
    ctx.fillStyle = "pink";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

export default ScoreBoard;