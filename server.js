//Dependencies:
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Required routes files:
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//Middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database Config:
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

//HomePage Route:
app.get("/", (req, res) => res.send("Hello World!"));

//Use Routes:
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

//Start the server:
app.listen(port, () => console.log(`Server listening on port ${port}`));
