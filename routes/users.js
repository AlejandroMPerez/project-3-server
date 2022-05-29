var express = require("express");
var router = express.Router();
const User = require("../models/User.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const saltRounds = 10;
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", function (req, res, next) {
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.email ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.json({ message: "Please fill out all fields" });
  }

  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "Username is taken" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
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
            const payload = {
              _id: createdUser._id,
              isAdmin: createdUser.isAdmin,
            };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr",
            });

            res.json({ token: token, id: createdUser._id });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  User.findOne({ username: req.body.username }).then((foundUser) => {
    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Username or password incorrect" });
    }

    const doesMatch = bcrypt.compareSync(req.body.password, foundUser.password);

    if (doesMatch) {
      const payload = { _id: foundUser._id, isAdmin: foundUser.isAdmin };

      const token = jwt.sign(payload, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "24hr",
      });

      res.json({ token: token, id: foundUser._id });
    } else {
      return res.status(400).json({ message: "Username or password incorrect" });
    }
  });
});

router.get("/update", isLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .then((currentUser) => {
      res.json(currentUser);
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/update", isLoggedIn, (req, res) => {
  const removeFalsy = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((prop) => {
      if (obj[prop]) {
        newObj[prop] = obj[prop];
      }
    });
    return newObj;
  };

  let updateInfo = removeFalsy(req.body);

  User.findByIdAndUpdate(req.user._id, { ...updateInfo }, { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/delete", isLoggedIn, (req, res) => {
  User.findByIdAndDelete(req.user._id)
    .then(() => {
      res.json({ message: "User was successfully deleted." });
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

module.exports = router;
