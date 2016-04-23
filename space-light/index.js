var express = require('express');
var expressHandlebars = require('express-handlebars');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var five = require('johnny-five');
var myBoard = new five.Board();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

//setup handlebars
app.engine('hbs', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

myBoard.on('ready', function(){
  console.log('ready to do stuff...');
  var led = new five.Led(13);
  // led.blink(500);


  //Still to add switch me on --
  io.on('connection', function(socket){
    socket.on('led:off', function(msg){
      console.log('switch me off..')
      led.stop().off();
    });
  });


  app.get('/', function(req, res){
      res.render('light');
  });

  app.post('/light', function(req, res){
      console.log(req.body)
      var lightStatus = req.body.status;
      //On off blink
      if(lightStatus  === 'on'){
        led.on();
      }
      else if(lightStatus === 'off'){
        led.stop().off();
      }
      else if(lightStatus === 'blink'){
        led.blink(250);

      }
      res.redirect('/');
  });

  var port = process.env.port || 3007;
  http.listen(port, function(){
      console.log('running at port :' , port)
  });



});
