import Cell from "./cell.js";
import SHAPES from "./shapes.js";

class Block {
  constructor(shapes, coord={i, j}){
    this.shapes = shapes.map(shape=>shape.map(rows=>rows.map(cell=>cell:new Cell(ctx))));
    this.coord = coord;
  }
}

export default Block;
