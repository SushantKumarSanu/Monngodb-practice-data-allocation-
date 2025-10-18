const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true})
.then(()=>console.log("code is running"))
.catch((err)=>console.log("something wrong with db"));

module.exports= mongoose;