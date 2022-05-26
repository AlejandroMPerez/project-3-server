var express = require("express");
var router = express.Router();
const Company = require("../models/Company.models");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require("../middleware/cloudinary.config.js");

//Create Companies
router.post("/create", isLoggedIn, (req, res) => {
  if (
    !req.body.name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.state
  ) {
    return res
      .status(400)
      .json({ message: "Name, address, city, and state are required fields." });
  } else {
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

    Company.create({
      ...updateInfo,
      // image: req.body.image,
      // name: req.body.name,
      // about: req.body.about,
      // address: req.body.address,
      // city: req.body.city,
      // state: req.body.state,
      // zip: req.body.zip,
      // phone: req.body.phone,
      // email: req.body.email,
      // url: req.body.url,
      creatorId: req.user._id,
    })

      .then((createdCompany) => {
        res.json(createdCompany);
      })
      .catch((err) => {
        res.json(err.message);
      });
  }
});

//View Companies
router.get("/all-companies", isLoggedIn, (req, res) => {
  Company.find()
    .populate("creatorId")
    .then((foundCompanies) => {
      res.json(foundCompanies);
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//View Company by ID
router.get("/all-companies/:id", isLoggedIn, (req, res) => {
  Company.findById(req.params.id)
    .then((foundCompany) => {
      console.log("FOUND COMPANY", foundCompany);
      res.json(foundCompany);
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//Get Update Companies route
router.get("/all-companies/:id/edit", isLoggedIn, (req, res, next) => {
  Company.findById(req.params.id)
    .then((editCompany) => {
      if (
        editCompany.creatorId.toHexString() === req.user._id ||
        req.user.isAdmin === true
      ) {
        res.json(editCompany);
      } else {
        res.json("You are not authorized to edit this page.");
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//Post Update Companies route
router.post("/all-companies/:id/edit", isLoggedIn, (req, res, next) => {
  Company.findByIdAndUpdate(req.params.id, {
    image: req.body.image,
    name: req.body.name,
    owner: req.body.owner,
    about: req.body.about,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    phone: req.body.phone,
    email: req.body.email,
    url: req.body.url,
  })
    .then(() => {
      res.json({ message: "Company was successfully updated" });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.post("/all-companies/:id/edit/delete", isLoggedIn, (req, res, next) => {
  Company.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: "Company was successfully deleted" });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//Cloudinary route.
router.post(
  "/image-upload",
  isLoggedIn,
  fileUploader.single("imageUrl"),
  (req, res) => {
    res.json(req.file.path);
  }
);

module.exports = router;
