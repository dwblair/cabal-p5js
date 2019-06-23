

// Keep track of our socket connection
var socket;
var peerList= new Set();
var messageList=new Set();
var localKey;

var y=10;

textFactor=10;

let numBalls = 0;
let spring = 0.05;
//let gravity = 0.03;
let gravity = 0.0;
// let gravity = 0.0;
//let friction = -0.9;
let friction = -0.1;
let balls = [];

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(400,400);
  background(0);
  //createCanvas(720, 400);
  
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:8899');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
socket.on('peer-connected',
    // When we receive data
    function(info) {
      console.log("Got: " + info);
      localKey=info.local_key.substring(0,5);
      console.log("local_key:",localKey);
      new_peer=info.peer.substring(0,3);
      if(peerList.has(new_peer)==false) {   
      peerList.add(new_peer);   
      
      // create a new ball for this peer
      numBalls=numBalls+1
      balls[numBalls-1] = new Ball(
      random(width),
      random(height),
      40,
      numBalls-1,
      balls,
      new_peer,
      [200,100]
    );
    
}
    
    }
  );

socket.on('message',
    // When we receive data
    function(info) {
	 background(0);
      console.log(info);
      sender=info.key.substring(0,5);
      message=info.value.content.text;
      console.log('sender:'+sender);
      console.log('message:'+message);
            
      // create a new ball for this message
      numBalls=numBalls+1
      balls[numBalls-1] = new Ball(
      random(width),
      random(height),
      message.length*10,
      numBalls-1,
      balls,
      message,      
      [100,100,210,200]
    );
    
	  
    }
  );
  
}

function draw() {
  background(0);
    noStroke();
  fill(255, 204);
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });

}

class Ball {
  constructor(xin, yin, din, idin, oin, textin,colorin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.text=textin;
    this.color=colorin;
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
	//fill(255, 204);
	fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    fill(0);
    text(this.text,this.x-this.diameter/4,this.y);
  }
}
