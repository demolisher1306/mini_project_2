const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const multer = require("multer");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

const url = "mongodb+srv://demolisher_1306:demolisher1306@mini-project.cl0gk.mongodb.net/ImageUpload?retryWrites=true&w=majority";

const Schema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
  },
  image :{
    data : Buffer,
    contentType : String

  }
});

const Immodel = new mongoose.model("imageUpload",Schema);

mongoose.connect(url/* ,{userNewUrlParser:true, useUnifiedTopology : true}*/).then(()=>{console.log("connected to db")});

const Storage = multer.diskStorage({
  destination : "uploads",
  filename : (req,file,cb)=>{
    cb(null,file.originalname);
  }
});

const upload = multer({
  storage : Storage
}).single("testfile");


app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/index.html");
});

app.post("/",(req,res)=>{
   upload(req,res,(err)=>{
     if(err){
       console.log(err);
     }
     else{
       const newImage = new Immodel({
         name : req.body.filename,
         image : {
           data : req.body.testfile,
           contentType : "image/png",
         },
       });
       newImage.save().then(()=>res.send("successfully uploaded")).catch((err)=>console.log(err));
     }
   });
});

app.listen(3000,()=>{
  console.log("server started");
})
