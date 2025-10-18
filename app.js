require('dotenv').config();
require('./db');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000 ;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.get('/',isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.render('index');
})
app.get('/create',(req,res)=>{
    res.render('create');   
})
app.post('/create',async(req,res)=>{
    let {username,name,age,password,email} = req.body
    let user = await userModel.findOne({email});
    if(user)return res.status(500).send('user already exists');
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let createduser =  await userModel.create({
                username,
                name,
                age,
                password:hash,
                email
            });
            let token = jwt.sign({email:email,userid:createduser._id},process.env.JWT_SECRET);
            res.cookie('token',token);
           return res.send("Registered");
        })
    })
})
app.get('/login',(req,res)=>{
  res.render('login');
});
app.post('/login',async (req,res)=>{
    let{username,email,password}= req.body;
    let user = await userModel.findOne({
        username,
        email
    })
    if(!user) return res.status(500).send("you are wrong motherlover");
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
          
              let token = jwt.sign({email:user.email,userid:user._id},process.env.JWT_SECRET);
            res.cookie('token',token);
             return res.send("you logged in");
        }else{
            res.redirect('/login');
        }
    })
})
app.get('/logout',(req,res)=>{
    res.cookie('token','');
    res.redirect('/login');
})
function isLoggedIn(req,res,next){
    if(req.cookies.token==="") return res.send('you need to login first');
    else{
      let data =   jwt.verify(req.cookies.token,process.env.JWT_SECRET);
      req.user = data;
    }
    next();
}



app.listen(PORT,(err)=>{
    if(err) console.log('something is off');
    console.log('its running');
})