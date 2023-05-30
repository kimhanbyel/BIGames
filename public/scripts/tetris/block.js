import Cell from "./cell.js";
import { CELL_SIZE } from "./global_variable.js";

class Block {
  constructor(shapes, coord={i, j}){
    this.shapes = shapes.map(shape=>shape.map(row=>row.map(cell=>{if (cell) return new Cell(CELL_SIZE, '#f00')})));
    this.coord = coord;
  }
  draw(ctx){
    this.shapes[0]
  }
}

export default Block;
