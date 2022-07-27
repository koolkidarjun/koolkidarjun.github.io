let canvas;
let ctx;
let gameLoop;
let score = 0
const WIDTH = 500
const HEIGHT = 500
const TILE_W = 25
const TILE_H = 25
const speed = 5
let has_moved = false
class Square {
    constructor(spot1, spot2) {
        this.color = "blue";
        this.x = spot1;
        this.y = spot2;
        this.xV = 0;
        this.yV= 0;
        this.xVQueue = this.xV
        this.yVQueue = this.yV
    }

    draw() {
      ctx.beginPath();
      ctx.rect(this.x + 2, this.y + 2, TILE_W - 4, TILE_H - 4)
      ctx.fillStyle = this.color;
      ctx.fill();


    }
    
    move() {
        if (this.x <= 0 || this.y <= 0 || this.x >= WIDTH - TILE_W || this.y >= HEIGHT - TILE_H) {
            
            game_over();
        }
  
        this.x += this.xV 
        this.y += this.yV 
        if (this.y%TILE_H == 0 && this.x%TILE_W == 0) {
            
            this.xV = this.xVQueue
            this.yV = this.yVQueue
     }
    }



}

class Apple {
    constructor(place1, place2) {
        this.radius = 10.5
        this.color = "red";
        this.x = place1;
        this.y = place2;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x + TILE_W / 2, this.y + TILE_H / 2, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();


    }
    eat() {
        let randomx = Math.floor(Math.random() * WIDTH / TILE_W) * TILE_W
        let randomy = Math.floor(Math.random() * HEIGHT / TILE_H) * TILE_H
        this.x = randomx
        this.y = randomy
        score++
        document.getElementById("score").innerText = score
        if (score > localStorage.getItem("high_score")){
            localStorage.setItem('high_score', score);
            document.getElementById("high_score").innerText = score
        }
    }
}

class Snake {
    constructor() {
        
        this.squares= [new Square(100, 250), new Square(75, 250), new Square(50, 250)];
    }
    draw() {
        for (let square of this.squares) {
            square.draw()
        }
    }
    move() {
        for (let i in this.squares) {
            this.squares[i].move()
            if (i==0) {
                continue
            }
            this.squares[i].yVQueue = this.squares[i-1].yV
            this.squares[i].xVQueue = this.squares[i-1].xV
            
        }

        for (let i = 3; i < this.squares.length; i++) {
            if (Math.abs(this.squares[0].x - this.squares[i].x) < TILE_W &&
                Math.abs(this.squares[0].y - this.squares[i].y) < TILE_H) {
                    game_over()

            }
        }
    }

    grow() {
        let last_sq = this.squares[this.squares.length - 1]
        let newX
        let newY
        if (last_sq.xV > 0 ){
            newX = last_sq.x - TILE_W
            newY = last_sq.y
        }
        if (last_sq.xV < 0 ){
            newX = last_sq.x + TILE_W
            newY = last_sq.y
        }
        if (last_sq.yV > 0 ){
            newX = last_sq.x
            newY = last_sq.y - TILE_H
        }
        if (last_sq.yV < 0 ){
            newX = last_sq.x
            newY = last_sq.y + TILE_H

        }
        let new_sq = new Square(newX, newY)
        new_sq.xV = last_sq.xV
        new_sq.yV = last_sq.yV
        this.squares.push(new_sq)
    }

}

var apple = new Apple(400, 250)
var snake = new Snake();
function loop() {
    var dark = false
    for (var x = 0; x < WIDTH; x += TILE_W) {
        for (var y = 0; y < HEIGHT; y += TILE_H) {
            ctx.beginPath();
            ctx.rect(x, y, TILE_W, TILE_H);
            if (dark) {
                ctx.fillStyle = "#07b007";
            } else {
                ctx.fillStyle = "#32cd32";
            }
            dark = !dark
            ctx.fill();
         
        }
        dark = !dark
    }
    apple.draw()
    snake.draw()
    snake.move()
    if (snake.squares[0].x == apple.x && snake.squares[0].y == apple.y) {
        apple.eat()
        snake.grow()
    }
}
window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    gameLoop = setInterval(loop, 1000/30)
    let high_score = localStorage.getItem("high_score");
    if (high_score == null){
        localStorage.setItem('high_score', 0)
        high_score = 0
    }
    document.getElementById("high_score").innerText = high_score
}

window.addEventListener('keydown', (event) => {
    switch (event.key) { 
        
        case 'ArrowUp' :
            if (has_moved == false){
                break;
            }
            if (snake.squares[0].yV > 0) {
                break;
            }
             snake.squares[0].yVQueue = -(speed) ;
             snake.squares[0].xVQueue = 0
              break;
        case 'ArrowDown' :
            if (has_moved == false){
                break;
            }
            if (snake.squares[0].yV < 0) {
                break;
            }
             snake.squares[0].yVQueue = speed;
             snake.squares[0].xVQueue = 0
              break;
        case 'ArrowLeft' :
            if (has_moved == false){
                break;
            }
            if (snake.squares[0].xV > 0) {
                break;
            }
             snake.squares[0].xVQueue = -(speed);
             snake.squares[0].yVQueue = 0
              break;
        case 'ArrowRight' :
            if (has_moved == false){
                for (let square of snake.squares) {
                square.xVQueue = speed ;
                square.yVQueue = 0
                }
                has_moved = true
                break;
            }
            if (snake.squares[0].xV < 0) {
                break;
            } 
            snake.squares[0].xVQueue = speed ;
            snake.squares[0].yVQueue = 0
            break;

        case 'r' :
            location.reload()
            break        
        
    }
    
});


function game_over(){
    ctx.font = "30px Arial";
    ctx.fillText("You Lost: Press r to restart", 10, 50)
    clearInterval(gameLoop);
    console.log('game over')
}

