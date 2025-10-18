const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.objectId,
        ref:'user'
    },
    date :{
        type:Date,
        default: date.now

    },
    content:String,
    likes:[
        [{type:mongoose.Schema.Types.ObjectId,ref:'user'}]
    ]
});

module.exports = mongoose.model('post',postSchema);