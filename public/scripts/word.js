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

export default Word;
