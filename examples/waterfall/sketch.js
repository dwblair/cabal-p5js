

// Keep track of our socket connection
var socket;
var peerList= new Set();
var localKey;

width = 100;
height=100;

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

socket.on('message',
    // When we receive data
    function(info) {
	 //background(0);
      console.log(info);
      sender=info.key.substring(0,5);
      message=info.value.content.text;
      console.log('sender:'+sender);
      console.log('message:'+message);
      px=time;
      epsilon=2;
      py=band*bh+epsilon;
	  stroke(255);
	  point(px,py);
	  point(px+1,py);
	  point(px-1,py);
	  point(px,py+1);
	  point(px,py-1);
    }
  );
  
}

function draw() {
  //background(0);
    stroke(200);
    px=time;
    py_top=band*bh;
    py_bottom=band*bh+bh;
    line(px,py_top,px,py_bottom);  
    time=time+1;
    if(time>width) {
		//background(0);
		time=0;
		band=band+1;
	}

}
