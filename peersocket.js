// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var Headless = require('./headless')
var minimist = require("minimist")
var argv = minimist(process.argv.slice(2))

var key = argv.cabal || 'cabal://0571a52685ead4749bb7c978c1c64767746b04dcddbca3dc53a0bf6b4cb8f398'

var opts = {}

var cabalkey = key.replace("cabal://", "").replace("cbl://", "")

var headless = Headless(cabalkey, { temp: opts.temp || false })



// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');
//var Cabal=require('cabal-core')

const port = 8899;

// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(port);

console.log('Server started on port '+port);


 
function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects

var id;

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
    //socket.broadcast.emit('peer',headless.peers() );
    console.log("connect to swarm ...");
    headless.disconnect();
    headless.connect();
    headless.id((my_id) => {
		id=my_id;
	})
	
	
    headless.onPeerConnected((peerId) => {
        //send_packet={ type: "peerConnected", data: peerId};
        //console.log(send_packet);
        //console.log(`${peerId} connected`)
        //console.log('got peers', headless.peers())
        console.log('headless.peers(): '+headless.peers());
        console.log('local key: '+id);
        send_packet={'local_key':id,'peer':peerId};
        
        //headless.post({'channel':'testing','message':'test! saw:'+peerId});
        
        //socket.broadcast.emit('peer',peerId.substring(0,5) );
        //socket.broadcast.emit('peer',peerId);
        socket.broadcast.emit('peer',send_packet);
 });
 
   headless.onMessageReceived((data) => {
        //send_packet={ type: "peerConnected", data: peerId};
        //console.log(send_packet);
        //console.log(`${peerId} connected`)
        //console.log('got peers', headless.peers())
        console.log('message received: '+data);
        //console.log('my id:',headless.id);
        //socket.broadcast.emit('peer',peerId.substring(0,5) );
        socket.broadcast.emit('message',data);
 });
    
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    
   
  }
);
