const express = require("express");
const router = express.Router();

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
  User.findOne({ email: req.body.email }).then;
});

module.exports = router;
