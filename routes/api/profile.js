const express = require("express");

const router = express.Router();

// Route =          GET api/profile/test
// Description =    Tests 'profile' route
// Access =         PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Profile works!" }));

module.exports = router;
