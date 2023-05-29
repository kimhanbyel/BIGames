class Cell {
  constructor(size, color){
    this.size = size;
    this.color = color;
  }  
  draw(ctx, pos={x, y}){
    ctx.fillStyle = this.color;
    ctx.fillRect(pos.x, pos.y, this.size, this.size);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(pos.x, pos.y, this.size, this.size);  
  }
}

export default Cell;