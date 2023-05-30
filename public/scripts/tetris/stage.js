import Cell from './cell.js';
import { CELL_SIZE } from './global_variable.js';

class Stage {
  constructor(pos={x, y}, rows, cols){ 
    this.pos  = pos;
    this.rows   = rows;
    this.cols   = cols;
    this.cells = new Array(cols).fill().map(e=>new Array(rows).fill().map(e=>new Cell(CELL_SIZE, '#444')));
  }
  draw(ctx){
    this.cells.map((rows, j) => rows.map((cell, i) => cell.draw(ctx, {x : this.pos.x + i*cell.size , y : this.pos.y + j*cell.size})))
  }
}

export default Stage;