import Stage from "./stage.js";
import Block from "./block.js";
import SHAPES from "./shapes.js";

const $div = document.querySelector("#tetris")
const $cvs = document.createElement("canvas");
$cvs.width = 1000;
$cvs.height = 600;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);
const CELL_SIZE = 30;

const s1= new Stage(ctx, {x:50,y:0}, 10, 20);
s1.draw();

const b = new Block(SHAPES['I'], {i:0, j:2});
console.log(b);


