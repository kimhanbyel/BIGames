import Cell from "./cell.js";

class Block {
  constructor(shapes, coord={i, j}){
    this.shapes = shapes.map(shape=>shape.map(rows=>rows.map(cell=>{if (cell) return new Cell()})));
    this.coord = coord;
  }
}

export default Block;
