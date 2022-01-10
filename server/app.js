const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const middleware = require("./authmiddleware");
const User = require('./User');
const mongoose = require('mongoose');


const uri = "mongodb+srv://root:root01@cluster0.lo5gm.mongodb.net/store?retryWrites=true&w=majority";
mongoose.connect(uri, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});





const app = express();
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.json({'msg':'Server Working Fine'});
});


// getUserFromToken
app.get('/getUser',(req,res)=>{
    if('token' in req.cookies) {    
        // verify the cookie and send the information
        const token = req.cookies['token'];
        try {
            const user = jwt.verify(token,config.get('secretKey'));
            res.status(200).json({'user':user,'isAuthenticated':true});
        }
        catch(err) {
            res.status(404).json({'isAuthenticated':false,'msg':'Invalid User'})
        }
    } else {
        return res.status(404).json({'isAuthenticated':false,'msg':'User Not Found'});
    }
});

app.post('/addUser',middleware.authMiddleware,(req,res)=>{
    try {
        const body = req.body;
        const user = new User(body);
        user.save();
        return res.json({'isAdded':true,'msg':'User Details Added Succesfully'});
    }
    catch(err) {
        return res.json({"msg":'User Details Not Added',"isAdded":false});
    }
    
});

app.get('/getAllUsers',middleware.authMiddleware,async (req,res)=>{
    try {
        const users = await User.find()
        return res.json({'users':users,'isSuccess':true,'msg':'Successfully Fetched All Users'});
    }
    catch(err) {
        // console.error(err);
        return res.json({'isSuccess':false,'msg':'Error In Fetching Users'});
    }
});

app.post('/login',(req,res)=>{
    const admin_email = config.get('email');
    const admin_password = config.get('password');
    const email = req.body.email;
    const password = req.body.password;
    const flag = admin_email===email && admin_password===password;
    if(flag) {
        const token = jwt.sign({'email':email},config.get('secretKey'),{expiresIn:'5m'});
        res.cookie('token',token,{maxAge:1000*60*5,httpOnly:true});
        return res.json({'msg':'Logged Successfully','success':flag,'token':token});
    } else {
        return res.json({'msg':'Incorrect Credentials','success':flag});
    }
});

app.get('/logout', (req, res)=>{
    try {
        res.cookie('token','',{maxAge:1});
        return res.json({msg:'Logged Out',isLogout:true});
    }
    catch(err) {
        return res.json({msg:'Unable To Logout Please Try Again',isLogout:false});
    }
    
});

app.listen(PORT,()=>{
    console.log(`Server is up and running on port ${PORT}`);
});