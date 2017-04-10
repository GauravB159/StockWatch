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

var stockSchema = new Schema({
  ticker:{type: String, required: true},
  username: { type: String, required: true} 
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

stockSchema.methods.create = function(tick,uname){

    var temp = mongoose.model('Stock',stockSchema)({
      ticker:tick,
      username:uname
    });
    temp.save(function(err) {
      if (err) throw err;
    });
}

stockSchema.methods.printAllUsers = function(){
    this.model('Stock').find({}, function(err, users) {
      if (err) throw err;

      console.log(users);
    });
}

stockSchema.methods.removeByUsername = function(uname){
    this.model('Stock').findOneAndRemove({ username: uname }, function(err) {
      if (err) throw err;
    });
}

stockSchema.methods.findByUsername = function(uname){
    this.model('Stock').find({ username: uname }, function(err, user) {
      if (err) throw err;
      console.log(user);
    });
}

stockSchema.methods.findByTicker = function(tick){
    this.model('Stock').find({ ticker: tick }, function(err, user) {
      if (err) throw err;
      console.log(user);
    });
}

var Stock = mongoose.model('Stock',stockSchema);
var User = mongoose.model('User', userSchema);
module.exports = {
    User: User,
    Stock:Stock
};

