var mongoose = require('mongoose');
mongoose.connect('mongodb://GauravB:gbgb@ds135830.mlab.com:35830/stockwatch');
//mongoose.connect('mongodb://localhost:27017/stockwatch');
var db = mongoose.connection;
var Schema=mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected");
});
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:{ type:String,required:true, unique: true},
  balance:{ type: Number, required:true}
});

var watchSchema = new Schema({
  ticker:{type: String, required: true},
  username: { type: String, required: true} 
});

var stockSchema = new Schema({
  ticker:{type: String, required: true},
  username: { type: String, required: true},
  price: {type: Number,required:true},
  quantity: {type:Number,required:true}
});
userSchema.methods.create = function(uname,pwd,eml,blnc){
    var temp = mongoose.model('User',userSchema)({
      username: uname,
      password: pwd,
      email:eml,
      balance:blnc
    });
    temp.save(function(err) {
      if (err) throw err;
    });
    console.log(temp);
}

userSchema.methods.findByUsername = function(uname,callback){
    this.model('User').findOne({ username: uname }, function(err, user) {
      if (err) throw err;
      callback(user);
    });
}

userSchema.methods.findByEmail = function(eml,callback){
    this.model('User').findOne({ email: eml }, function(err, user) {
      if (err) throw err;
      callback(user);
    });
}

userSchema.methods.printAllUsers = function(){
    this.model('User').find({}, function(err, users) {
      if (err) throw err;
      console.log(users);
    });
}

userSchema.methods.removeByUsername = function(uname){
    this.model('User').findOneAndRemove({ username: uname }, function(err) {
      if (err) throw err;
    });
}
userSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};
watchSchema.methods.create = function(tick,uname){

    var temp = mongoose.model('Watch',watchSchema)({
      ticker:tick,
      username:uname
    });
    temp.save(function(err) {
      if (err) throw err;
    });
}

watchSchema.methods.printAllUsers = function(){
    this.model('Watch').find({}, function(err, users) {
      if (err) throw err;

      console.log(users);
    });
}

watchSchema.methods.removeByUsername = function(uname){
    this.model('Watch').findOneAndRemove({ username: uname }, function(err) {
      if (err) throw err;
    });
}

watchSchema.methods.findByUsername = function(uname,callback){
    this.model('Watch').find({ username: uname }, function(err, user) {
      if (err) throw err;
      callback(user);      
    });
}

watchSchema.methods.findByTicker = function(tick,callback){
    this.model('Watch').find({ ticker: tick }, function(err, user) {
      if (err) throw err;
      callback(user);
    });
}
watchSchema.methods.removeByUandS = function(uname,tick,callback){
    this.model('Watch').findOneAndRemove({ username: uname,ticker:tick }, function(err) {
      if (err) throw err;
      callback(user);
    });
}
stockSchema.methods.create = function(tick,uname,prce,qty){
    var temp = mongoose.model('Stock',stockSchema)({
      ticker:tick,
      username:uname,
      price:prce,
      quantity:qty
    });
    temp.save(function(err) {
      if (err) throw err;
    });
}
stockSchema.methods.printAllStocks = function(){
    this.model('Stock').find({}, function(err, users) {
      if (err) throw err;

      console.log(users);
    });
}
stockSchema.methods.findByUsername = function(uname,callback){
    this.model('Stock').find({ username: uname }, function(err, user) {
      if (err) throw err;
      callback(user);
    });
}
stockSchema.methods.removeByUandS = function(uname,tick,callback){
    this.model('Stock').findOneAndRemove({ username: uname,ticker:tick }, function(err) {
      if (err) throw err;
      callback(user);
    });
}
var Stock = mongoose.model('Stock',stockSchema);
var User = mongoose.model('User', userSchema);
var Watch=mongoose.model('Watch',watchSchema);
module.exports = {
    User: User,
    Stock:Stock,
    Watch:Watch 
};

