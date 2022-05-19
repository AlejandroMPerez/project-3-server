var express = require("express");
var router = express.Router();
const User = require("../models/User.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const saltRounds = 10;
const isLoggedIn = require("../middleware/isLoggedIn")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", function (req, res, next) {
  //1. Make sure fields are filled out
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName)  {
    return res.json({ message: "Please fill out all fields" });
  }

  //2. Make sure username isn't taken
    User.findOne({username: req.body.username})
      .then((foundUser) => {
        if (foundUser) {
          return res.status(400).json({message: "Username is taken"})
        } else {
          //3 Hash the password
          //3.1 Generate the salt
          const salt = bcrypt.genSaltSync(saltRounds)
          //3.2 Hash the password
          const hashedPassword = bcrypt.hashSync(req.body.password, salt)
          //4 Create the account
          User.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            city: req.body.city,
            state: req.body.state,
            isAdmin: false,
          })
          .then((createdUser) => {
            //5. Create the JSON Web Token (JWT)
            //5.1 Create the payload
            const payload = {_id: createdUser._id, isAdmin: createdUser.isAdmin}

            //5.2 Create the token
            const token = jwt.sign(
              payload,
              process.env.SECRET,
              { algorithm: "HS256", expiresIn: "24hr"}
            )

            res.json({ token: token, id: createdUser._id })
          })
          .catch((err) => {
            res.json(err.message)
          })
        }
      })
      .catch((err) => {
        res.json(err.message)
      })
});

router.post("/login", function (req, res, next) {
  //1. Make sure fields are filled out
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  //2. Check username
  User.findOne({username: req.body.username})
    .then((foundUser) => {
      //2.1 Make sure user exists
      if(!foundUser) {
        return res.status(400).json({message: "Username or password incorrect"})
      }

      //2.2 Make sure password match
      const doesMatch = bcrypt.compareSync(req.body.password, foundUser.password)

      //3 Create a token
      if(doesMatch) {
        //3.1 Create the payload
        const payload = {_id: foundUser._id, isAdmin: foundUser.isAdmin}

        //3.2 Create the token

        const token = jwt.sign(
          payload,
          process.env.SECRET,
          { algorithm: "HS256", expiresIn: "24hr"}
        )

        res.json({ token: token, id: foundUser._id })
      } else {
        return res.status(400).json({message: "Username or password incorrect"})
      }
    })
}); 

// router.get("/login-test", isLoggedIn, (req, res) => {
//   //console.log("User", req.user)
//   res.json({message: "You are logged in"})
// })

router.get("/update", isLoggedIn, (req, res) => {
  User.findById(req.user._id)
  .then((currentUser) => {
    res.json(currentUser)
    // res.json({user: req.user})
// console.log("REQ.USER.ID", req.user)
// console.log("CURRENT USER", currentUser)
  })
  .catch((err) => {
    res.json(err.message)
  })
  
})

router.post("/update", isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    city: req.body.city,
    state: req.body.state,
  })
  .then(() => {
    //console.log("UPDATE", updatedUser)
    res.status({message: "Profile was successfully updated."})
  })
  .catch((err) => {
    res.json(err.message)
  })
})

router.post("/delete", isLoggedIn, (req, res) => {
  User.findByIdAndDelete(req.user._id)
  .then(() => {
    console.log("USER DELETED")
    res.json({message: "User was successfully deleted."})
  })
  .catch((err) => {
    res.json(err.message)
  })
})



module.exports = router;
