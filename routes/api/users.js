const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input Validation:
const validateRegisterInput = require("../../validation/register");

//Load User Model:
const User = require("../../models/User");

// Route =          GET api/users/test
// Description =    Tests 'users' route
// Access =         PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// Route =          GET api/users/register
// Description =    Registers a user
// Access =         PUBLIC
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation:
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Check if email already exists, if not allow user to register and hash the created pw:
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "This email already exists.";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default Icon
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// Route =          GET api/users/login
// Description =    Logs in a user / Returning JWT Token
// Access =         PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email:
  User.findOne({ email }).then(user => {
    //Check for user:
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    }

    //Check password:
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched:
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //Create JWT Payload

        //Sign Token:
        jwt.sign(
          payload,
          keys.secretKey,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        ); //Token expiresIn 24 hours. (3600 * 24)
      } else {
        return res.status(400).json({ password: "Password is incorrect." });
      }
    });
  });
});

// Route =          GET api/users/current
// Description =    Return current user
// Access =         PRIVATE
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
