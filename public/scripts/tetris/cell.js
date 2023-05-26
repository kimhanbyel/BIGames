class Cell {
  constructor(ctx, size, color){
    this.size = size;
    this.color = color;
    this.ctx = ctx;
  }  
  draw(pos={x, y}){
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(pos.x, pos.y, this.size, this.size);
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(pos.x, pos.y, this.size, this.size);  
  }
}

export default Cell;