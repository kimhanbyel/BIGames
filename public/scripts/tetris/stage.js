import Cell from './cell.js';

class Stage {
  constructor(ctx, pos={x, y}, rows, cols){ 
    this.pos  = pos;
    this.rows   = rows;
    this.cols   = cols;
    this.ctx = ctx;
    this.cells = new Array(cols).fill().map(e=>new Array(rows).fill().map(e=>new Cell(30, '#444')));
  }
  draw(){
    this.cells.map((rows, j) => rows.map((cell, i) => cell.draw(this.ctx, {x : this.pos.x + i*cell.size , y : this.pos.y + j*cell.size})))
  }
}

export default Stage;