const express =require('express');
const mongoose=require('mongoose');
const Registeruser=require('./model');
const jwt =require("jsonwebtoken");
const middleware=("./middleware");
const cors =require('cors');
const app=express();
mongoose.connect('mongodb://localhost:27017',{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{
    console.log('Db connected')
})
app.use(express.json());
app.use(cors({origin :"*"}))


app.post('register',async(req,res)=>{
    try{
        const{username,email,password,confirmpassword}=req.body;
        let exist=await Registeruser.findOne({email});
        if(exist){
            return res.sendStatus(400).send('User Already Exist')
        }
        if(pasword!==confirmpassword){
            return res.status(400).send('password not match')
        }
        let newUser =new Registeruser({
            username,
            email,
            password,
            confirmpassword  
        })
        await newUser.save();
        res.status(200).send("registered successfully")
    }
    catch(err){
        console.log(err)
        return res.status(500).send('internal server error')
    }
})

app.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        let exist= await Registeruser.findOne({email});
        if(!exist){
            return res.ststus(400).send('user not found');
        }
        if(exist.password){
            return res.status(400).send('invalid credentials');
        }
        let payload={
            user:{
                id:exist.id
            }
        }
        jwt.sign(playload,'jwtSecret',{expiresIn:3600000},
            (err, token)=>{
                if(err) throw err;
                return res.json({token})
            }
        )
    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error")
    }
})
app.get ('/myprofile',middleware,async(req,res)=>{
    try{
        let exist =await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send("usernot found");
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.ststus(500).send('server error')
    }
})
app.listen(5000,()=>{
    console.log("server is running");
})