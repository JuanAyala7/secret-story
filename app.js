//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejis = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login", {errMsg: "", username: "", password: ""});
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User ({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
     }
   });
  });
//           console.log("New login (" + username + ")");
//         } else {
//           res.render("login", {errMsg: "Email or password incorrect", username: username, password: password});
//         }
//       } else {
//         res.render("login", {errMsg: "Email or password incorrect", username: username, password: password});
//       }
//     }
//   });
// });

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
