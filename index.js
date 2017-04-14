var express = require("express");
var bodyParser=require("body-parser");
var http=require("http");
var $=require("jquery");
var app = express();
var fs = require('fs');
var db = require('./db');
var session = require('express-session')
var user=new db.User();
var stock=new db.Stock();
var watch=new db.Watch();
var port = process.env.PORT || 5000;
var cheerio = require('cheerio');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(session({
    secret: "Hello There", // connect-mongo session store
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
/*var CronJob = require('cron').CronJob;
new CronJob('30 * * * * *', function() {
  console.log('You will see this message every second');
}, null, true);*/
var interval=60;
function writeStock(url,name){
http.get(url, function(res){
        var body = '';
        res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        var tJson = JSON.parse(body);
        fs.writeFileSync(name+'.json', JSON.stringify(tJson));
    });

    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
app.set('view engine', 'ejs');
app.use(express.static(__dirname ));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var ticker=0;

app.post('/stock', function(req, res){
    ticker=req.body.ticker;
    res.sendFile('stock.html', { root: __dirname} );
});
app.post('/stocklogged', function(req, res){
    ticker=req.body.ticker;
    var acc=req.session.passport.user.username;    
    res.render('stock',{acc:acc});
});
app.get('/stocklogged', function(req, res){
    ticker=req.body.ticker;
    var acc=req.session.passport.user.username;    
    res.render('stock',{acc:acc});
});
app.get('/chart', function(req, res){
    res.sendFile('chart.html', { root: __dirname} );
});
app.get('/currency', function(req, res){
    var url="http://api.fixer.io/latest?base=USD";
    writeStock(url,"currency");    
    res.sendFile('currency.html', { root: __dirname} );
});
app.post('/watch',function(req,res){
    var acc=req.session.passport.user.username;
    var ticker=req.body.ticker;
    watch.create(ticker,acc);
    res.send("Stock added to watchlist");
});
app.get('/watchlist',function(req,res,next){
    var acc=req.session.passport.user.username;  
    var up={"stocks":[]};
    var down={"stocks":[]};        
    watch.findByUsername(acc,function(user){
        if(user == ""){
            res.render('watchlist',{acc:acc,up:up,down:down});    
        }
        for(var i=0;i < user.length;i++){
            var ticker=user[i].ticker;
            var url = 'http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticker+'&apikey=1977';
            writeStock(url,"daily/"+ticker);
            var obj;
            fs.readFile('daily/'+ticker+".json", 'utf8', function (err, data) {
                  if (err) throw err;
                  obj = JSON.parse(data);
                  var symbol=obj["Meta Data"]["2. Symbol"]; 
                  var date=obj["Meta Data"]["3. Last Refreshed"];
                  obj=obj["Time Series (Daily)"];
                  var count=0;
                  var obj2;
                  for(var date2 in obj){
                      if(count == 1){
                        obj2=obj[date2];
                        break;
                      }
                      count+=1;
                  }                  
                  obj=obj[date];
                  ud=[];
                  for(var price in obj){
                      if(obj[price]-obj2[price] > 0){
                          ud.push(true);  
                      }else{
                          ud.push(false);
                      }
                  }
                  var stock={"ticker":symbol,"open":{"data":parseFloat(obj['1. open']).toFixed(2),"ud":ud[0]},"close":{"data":parseFloat(obj['4. close']).toFixed(2),"ud":ud[3]},"high":{"data":parseFloat(obj['2. high']).toFixed(2),"ud":ud[1]},"low":{"data":parseFloat(obj['3. low']).toFixed(2),"ud":ud[2]}};
                  if(ud[3] == true){
                      up["stocks"].push(stock);
                  }else{
                      down["stocks"].push(stock);
                  }
                  if(i == user.length && symbol == ticker){
                      res.render('watchlist',{acc:acc,up:up,down:down});             
                  }
            });
        }
    });
});
app.get('/ticker',function(req,res){
    res.send(ticker);
});
app.get('/loggedin',function(req,res){
    var acc=req.session.passport.user.username;
    res.render('profile',{acc:acc});
});
app.post('/register',function(req,res){
    var uname=req.body.un;
    var eml=req.body.email;
    var pass=req.body.password;
    var cpass=req.body.cpassword;
    var message;
    if(pass != cpass){
        res.status(400);
        message="Passwords do not match";
    }
    db.User.find({$or : [{username:uname},{email:eml}]}, function(err, data) {
      if (err) throw err;
      if(data == "" && pass == cpass){
          user.create(uname,pass,eml,500);
          res.sendFile('index.html', { root: __dirname} );
      }else if(data != ""){
          user.findByUsername(uname,function(data){
                res.status(400);
                if(data != null){
                    message="Username already exists";
                }else if(pass != cpass){
                    message="Passwords do not match";
                }else{
                    message="Email already exists";
                }
                res.send(message);
          });
      }
    });
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/loggedin',
                                   failureRedirect: '/' }));


app.post('/time',function(req, res){ 
      var body = req.body;
      interval=body.number;
      var url = 'http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ticker+'&interval='+interval+'min&apikey=1977';
      var url2 = 'http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticker+'&apikey=1977';
      var url3 = 'http://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='+ticker+'&apikey=1977';
      var url4 = 'http://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol='+ticker+'&apikey=1977';
      writeStock(url,"interval");  
      writeStock(url2,"daily/"+ticker);
      writeStock(url3,"weekly");    
      writeStock(url4,"monthly");        
      res.send("OK");
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
