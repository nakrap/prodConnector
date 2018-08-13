const express = require("express");

const router = express.Router();

// Route =          GET api/posts/test
// Description =    Tests 'posts' route
// Access =         PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));

module.exports = router;
