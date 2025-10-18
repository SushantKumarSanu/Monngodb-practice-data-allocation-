const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    password:String,
    email:String,  
    userpost:[{type:mongoose.Schema.Types.ObjectId,ref:'post'}]
});

module.exports = mongoose.model('user',userSchema);