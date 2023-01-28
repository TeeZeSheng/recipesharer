const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router  = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save().then(result => {
      res.status(201).json({
        message: "Success!",
        result: result
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "This email has been taken"
      })
    })

  })

});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email}).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password)
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Invalid email or password!"
      });
    }else{
      //create new token
      const token = jwt.sign({email: fetchedUser.email, userID: fetchedUser._id}, 'asdfghjkl;asdfghjkl;asdfghjkl;', {expiresIn: "1h"});
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userID: fetchedUser._id
      })
    }
  })
  .catch(err => {
    return res.status(401).json({
      message: "Invalid email or password!"
    })
  })
})

module.exports = router;
