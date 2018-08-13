const express = require("express");

const router = express.Router();

// Route =          GET api/users/test
// Description =    Tests 'users' route
// Access =         PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

module.exports = router;
