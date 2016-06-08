var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var msgSchema =new Schema({
    user_id: String,
    user_name: String,
    to_name: String,
    to_id:String,
    msg: String,
    time_readable: Date,
    is_seen:Boolean

})
msgSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.time_readable = currentDate;
 

  next();
});
var Message =mongoose.model('Message', msgSchema);
module.exports = Message;
