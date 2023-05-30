import Stage from "./stage.js";
import Block from "./block.js";
import SHAPES from "./shapes.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./global_variable.js";

const $div = document.querySelector("#tetris")
const $cvs = document.createElement("canvas");
$cvs.width = CANVAS_WIDTH;
$cvs.height = CANVAS_HEIGHT;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);

const s1 = new Stage({x:50,y:0}, 10, 20);
s1.draw(ctx);

const b = new Block(randomShape(), {i:0, j:2});
console.log(b);


