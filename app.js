//jshint esversion:6
require("dotenv").config();


 const express = require("express")
 const ejs = require("ejs")
 const bodyParser = require("body-parser")
 const mongoose = require("mongoose")
 const session = require("express-session")
 const passport = require("passport")
 const passportLocalMongoose = require("passport-local-mongoose")

 


 const app = express()


 app.use(express.static("public"));
 app.set('view engine', 'ejs')
 app.use(bodyParser.urlencoded({
  extended : true
 }));

 // sesion
 app.use(session({
  secret: "Long string.",
  resave: false,
  saveUninitialized: false
 }));

 // initialized session
 app.use(passport.initialize())
 app.use(passport.session())



 mongoose.connect("mongodb+srv://ljm12543:Jmlopez2001@cluster0.szsdpic.mongodb.net/SecretsDB?retryWrites=true&w=majority",
 {
   useNewUrlParser : true,
   useUnifiedTopology : true
 });
 

 const userSchema = new mongoose.Schema({
  email : String,
  password : String
 })

 userSchema.plugin(passportLocalMongoose);

 
 const User = mongoose.model("User", userSchema)

 //passport
 passport.use(User.createStrategy());

 passport.serializeUser(function(user,done){
  done(null, user)
 });
 passport.deserializeUser(function(user,done){
  done(null,user)
 });


 app.get("/", function(req,res) {
  res.render("home")
 })

 app.get("/login", function(req,res) {
  res.render("login")
 })

 app.get("/register", function(req,res) {
  res.render("register")
 })

 app.get("/secrets", function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets")
  }else{
    res.redirect("/login")
  }
 })

 app.post("/register", function(req, res){
  
  User.register({username: req.body.username},  req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register")
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets")
      })
    }
  })
  
 })

 app.post("/login", function(req, res){
  
  const user = new User({
    usermame : req.body.username,
    password : req.body.password
  })

  req.login(user, function(err){
    if(err){
      console.log(err)
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets")
      })
    }
  })

 })

 app.get("/logout", function(req,res){
  req.logout(() => res.redirect("/"));
 
 })


 app.listen(3000, () => console.log("Listening to port 3000"))