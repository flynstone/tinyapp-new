const express = require("express");
const app = express();
const PORT = 8080; 

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// ~~~~~~~~~~ Get Urls ~~~~~~~~~~ //
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars);
});

// Make sure this is above ("/urls/:id")
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// ~~~~~~~~~~ Get shortURL ~~~~~~~~~~ //
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL
  }
  res.render("urls_show", templateVars);
});

