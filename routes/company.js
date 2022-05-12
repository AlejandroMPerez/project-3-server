var express = require("express");
var router = express.Router();
const Company = require("../models/Company.models");
const isLoggedIn = require("../middleware/isLoggedIn")


//Create Companies
router.post("/create", isLoggedIn, (req, res) => {
    if (!req.body.name || !req.body.address || !req.body.city || !req.body.state) {
        return res.json({ message: "Name, address, city, and state are required fields." });
    }
    
    Company.create({
        image: req.body.image,
        name: req.body.name,
        owner: req.body.owner,
        about: req.body.about,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
        email: req.body.email,
        url: req.body.url,
        creatorId: req.user._id
    })
    .then((createdCompany) => {
        console.log("COMPANY RESULTS", createdCompany)
    })
    .catch((err) => {
        res.json(err.message)
      })
})

//View Companies
router.get("/all-companies", isLoggedIn, (req, res) => {
    Company.find()
    .then((foundCompanies) => {
        console.log("FOUND COMPANIES", foundCompanies)
    })
    .catch((err) => {
        res.json(err.message)
      })
})

//View Company by ID
router.get("/all-companies/:id", isLoggedIn, (req, res) => {
    Company.findById(req.params.id)
    .then((foundCompany) => {
        console.log("FOUND COMPANY", foundCompany)
    })
    .catch((err) => {
        res.json(err.message)
      })
})

module.exports = router;