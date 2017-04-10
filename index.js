var express = require("express");
var bodyParser=require("body-parser");
var http=require("http");
var $=require("jquery");
var app = express();
var fs = require('fs');
var db = require('./db');
var session = require('client-sessions');
var user=new db.User();
var stock=new db.Stock();
var port = process.env.PORT || 5000;
let cheerio = require('cheerio');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(session({
  cookieName: 'session',
  secret: 'abcdefghijskamx',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
/*var CronJob = require('cron').CronJob;
new CronJob('30 * * * * *', function() {
  console.log('You will see this message every second');
}, null, true);*/
user.printAllUsers();
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
app.set('view engine', 'ejs');
app.use(express.static(__dirname ));
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    db.User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; 
        req.session.user = user; 
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
});
function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};
var ticker=0;

app.post('/stock', function(req, res){
    ticker=req.body.ticker;
    res.sendFile('stock.html', { root: __dirname} );
});
app.get('/chart', function(req, res){
    res.sendFile('chart.html', { root: __dirname} );
});
app.get('/currency', function(req, res){
    var url="http://api.fixer.io/latest?base=USD";
    writeStock(url,"currency");    
    res.sendFile('currency.html', { root: __dirname} );
});
app.get('/ticker',function(req,res){
    res.send(ticker);
});
app.get('/loggedin', requireLogin,function(req,res){
    var acc=req.session.user.username;
    app.render('profile',{acc:acc},function(err, html) {
        res.send(html);
    });
});
app.post('/register',function(req,res){
    var uname=req.body.un;
    var eml=req.body.email;
    var pass=req.body.password;
    var cpass=req.body.cpassword;
    console.log(uname);
    var message;
    if(pass != cpass){
        res.status(400);
        message="Passwords do not match";
    }
    db.User.find({$or : [{username:uname},{email:eml}]}, function(err, data) {
      if (err) throw err;
      if(data == "" && pass == cpass){
          console.log("hell");
          user.create(uname,pass,eml,500);
          res.sendFile('index.html', { root: __dirname} );
      }else if(data != ""){
          console.log("hell2");
          console.log("x"+data);
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

app.post('/login',function(req,res){
    var uname=req.body.uname;
    var pass=req.body.password;
    var message;
    user.findByUsername(uname,function(user){
        if(user == null){
            res.status(500);
            message="User not found";
        }else if(user.password != pass){
                res.status(500);
            message="Incorrect Password";
        }else{
            req.session.user = user;
            res.redirect("/loggedin");
        }
        res.send(message);
    });
});

app.post('/time',function(req, res){ 
      var body = req.body;
      interval=body.number;
      var url = 'http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ticker+'&interval='+interval+'min&apikey=1977';
      var url2 = 'http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticker+'&apikey=1977';
      var url3 = 'http://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='+ticker+'&apikey=1977';
      var url4 = 'http://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol='+ticker+'&apikey=1977';
      writeStock(url,"interval");  
      writeStock(url2,"daily");
      writeStock(url3,"weekly");    
      writeStock(url4,"monthly");        
      res.send("OK");
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
