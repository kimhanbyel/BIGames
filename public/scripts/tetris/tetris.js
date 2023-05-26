const $div = document.querySelector("#tetris")
const $cvs = document.createElement("canvas");
$cvs.width = 1000;
$cvs.height = 600;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);
const CELL_SIZE = 30;

const cell = (i, j, color) =>{
  ctx.fillStyle = color;
  ctx.fillRect(CELL_SIZE*i,CELL_SIZE*j,CELL_SIZE,CELL_SIZE);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(CELL_SIZE*i,CELL_SIZE*j,CELL_SIZE,CELL_SIZE);
}

// for(let j=0; j<20; j++){
//   for(let i=0; i<10; i++){
//     cell(i,j,'#444');
//   }
// }

// const draw = () =>{
//    console.log("전역 함수")
// }

class Cell {
  constructor(size, color){
    this.size = size;
    this.color = color;
  }
  
  draw(pos={x, y}){
    ctx.fillStyle = this.color;
    ctx.fillRect(pos.x, pos.y, this.size, this.size);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(pos.x, pos.y, this.size, this.size);  
  }
}

const c = new Cell(30, '#444');
c.draw({x:0,y:0});





// const d = new Cell("yellow");

// c.draw2();
// d.draw2();
