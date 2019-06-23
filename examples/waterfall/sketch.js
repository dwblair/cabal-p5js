

// Keep track of our socket connection
var socket;
var peerList= new Set();
var localKey;

width = 300;
height=300;

bh = height/4;

var time=0;
var band=0;

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(width, height);

  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:8899');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
socket.on('peer',
    // When we receive data
    function(info) {
      console.log("Got: " + info);
      localKey=info.local_key.substring(0,5);
      console.log("local_key:",localKey);
      new_peer=info.peer.substring(0,3);
      peerList.add(new_peer);   
  
    }
  );


  
  socket.on('peer-connected',
    // When we receive data
    function(info) {
	 //background(0);
      console.log(info);
      new_peer=info.peer.substring(0,5);
      peerList.add(new_peer); 
      console.log(peerList);
    }
  );
  
  
}

function draw() {
stroke(50);
    px=time;
    py_top=band*bh;
    py_bottom=band*bh+bh;
    line(px,py_top,px,py_bottom);



peerIndex=1
delta=10
 peerList.forEach(peer => {
	 randomColor=color(random(255),random(255),random(255));
	 fill(randomColor);
	 noStroke();
    rect(px-3,band*bh+peerIndex*delta,3,3);
    peerIndex=peerIndex+1;
  });
  
  
  //update the time
    time=time+1;
    if(time>(width+1)) {
		
		time=0;
		band=band+1;
	}

}
