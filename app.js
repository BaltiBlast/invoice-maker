const express = require("express");
const router = require("./router");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.static("public"));
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`La broche tourne sur http://localhost:${port}`);
});
