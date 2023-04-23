//jshint esversion:6
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { performance } = require('perf_hooks');
const { update } = require('lodash');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/Assignment", {useNewUrlParser: true});

const signSchema = {
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
};

const gameSchema = {
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  level : {
    type : Number,
    required : true
  },
  entrytime : {
    type : Number,
    required : true
  },
  presenttime : {
    type : Number,
    required : true
  },
  timetaken :{
    type : Number,
    required : true
  }
};



const Register = mongoose.model("Register", signSchema);
const Game = mongoose.model("Game", gameSchema);


var level1 ="I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?";
var level1ans = "fire";

var level2 ="What is black when you buy it, red when you use it, and gray when you throw it away?";
var level2ans = "charcoal";

var level3 ="What is it that goes up, but never comes down?";
var level3ans = "age";
// for(var i=0;i<level1.length;i++)
// {
//   console.log(level1[i]);
//   console.log(level1ans[i]);
// }


app.get("/", async (req, res) => {
  try {
    
    res.render("home");
  } catch (err) {
    console.log(err);
  }
});

app.get("/level6", async (req, res) => {
  try {
    
    res.render("level6");
  } catch (err) {
    console.log(err);
  }
});


app.get("/level5/:email", async (req, res) => {
  try {
    const email = req.params.email;
    await Game.updateOne({email : email},{
      level : 5
    });
    res.render("level5",{
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/level5complete/:email", async (req, res) => {
  try {
    const email = req.params.email;
    await Game.updateOne({email : email},{
      level : 6
    });
    res.redirect("/gamepage/"+email);
  } catch (err) {
    console.log(err);
  }
});

app.get("/level1/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("level1",{
      level1 : level1,
      level1ans : level1ans,
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});






app.get("/level2/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("level2",{
      level2 : level2,
      level2ans : level2ans,
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});


app.get("/level3/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("level3",{
      level3 : level3,
      level3ans : level3ans,
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/level4/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("level4",{
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/failure1/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("failure1",{
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/failure2/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("failure2",{
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/failure3/:email", async (req, res) => {
  try {
    const email = req.params.email;
    res.render("failure3",{
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/about", async (req, res) => {
  try {
    
    res.render("about");
  } catch (err) {
    console.log(err);
  }
});

app.get("/contact", async (req, res) => {
  try {
    
    res.render("contact");
  } catch (err) {
    console.log(err);
  }
});

app.get("/login", async (req, res) => {
  try {
    
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});

app.get("/gamepage/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const posts = await Game.findOne({
      email: email
   } );
    

    // console.log(typeof timetaken);
    // console.log(posts.timetaken);
    res.render("gamepage",{
      posts : posts
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/continue/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const posts = await Game.findOne({
      email: email
   } );

    var x= posts.level;
    //console.log(x);
    x=x+1;
    // console.log(typeof timetaken);
    // console.log(posts.timetaken);
    res.redirect("/level"+x+"/"+email);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async(req,res)=>{
  try{
      const email = req.body.email;
      const password = req.body.password;

      const usermail = await Register.findOne({email:email});
      if(usermail == null){
        res.send("Invalid Login Details");
      }else if(usermail.password === password){
        const posts = await Game.findOne({
          email: email
       } );

      //  console.log(posts.entrytime);
      //  console.log(new Date().getTime());
       var timetakens = (new Date().getTime()) - posts.entrytime;
       //console.log(timetakens);



        await Game.updateOne({email : email},{
          presenttime :  new Date().getTime(),
          timetaken : timetakens
        });

        res.redirect("/gamepage/" + email);
        
      }else{
        res.send("Invalid Login Details");
      }

      
      
  }
  catch(err)
  {
    console.log(err);
  }
});

app.post("/level1/:email", async(req,res)=>{
  try{
      const email = req.params.email;
      const ans = req.body.ans;
      if(ans===level1ans)
      {
        await Game.updateOne({email : email},{
          level : 2
        });
        res.redirect("/level2/"+email);
      }
      else{
        res.redirect("/failure1/"+email);
      }

      
      
  }
  catch(err)
  {
    console.log(err);
  }
});

app.post("/level2/:email", async(req,res)=>{
  try{
      const email = req.params.email;
      const ans = req.body.ans;
      if(ans===level2ans)
      {
        await Game.updateOne({email : email},{
          level : 3
        });
        res.redirect("/level3/"+email);
      }
      else{
        res.redirect("/failure2/"+email);
      }

      
      
  }
  catch(err)
  {
    console.log(err);
  }
});


app.post("/level3/:email", async(req,res)=>{
  try{
      const email = req.params.email;
      const ans = req.body.ans;
      if(ans===level3ans)
      {
        await Game.updateOne({email : email},{
          level : 4
        });
        res.redirect("/level4/"+email);
      }
      else{
        res.redirect("/failure3/"+email);
      }

      
      
  }
  catch(err)
  {
    console.log(err);
  }
});



app.get("/register", async (req, res) => {
  try {
    //const posts = await Post.find({ });
    res.render("register");
  } catch (err) {
    console.log(err);
  }
});

app.get("/leaderboard/:email", async (req, res) => {
  try {
    var email = req.params.email;
    var posts = await Game
    .find()
    .sort({level : -1 , timetaken : 1});
    //posts.sort(([a, b], [c, d]) => c - a || b - d);
    console.log(posts);
    res.render("leaderboard",{
      posts : posts,
      email : email
    });
  } catch (err) {
    console.log(err);
  }
});



app.post("/register",async (req,res) => {

  
  const post = new Register ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  

  const game = new Game ({
    name: req.body.name,
    email: req.body.email,
    level : 0,
    timetaken : 0,
    entrytime : new Date().getTime(),
    presenttime : new Date().getTime()

  });

  game.save().then(()=>{
    post.save().then(()=>{
      res.redirect("/login");
    }).catch((err)=>{
      console.log(err);
    });
  }).catch((err)=>{
    console.log(err);
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
