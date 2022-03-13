const express = require("express");
const app = express();
const PORT = 8080; 
const bcrypt = require("bcryptjs");

// Import body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Import Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// Helpers
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

const checkPassword = (email, password, db) => {
  if (!email || !password) {
    console.error(403);
    return;
  }

  for(let user in db) {
    if(db[user].email === email && db[user].password) {
      return db[user];
    }
  }
}

const emailExists = (email, password, users) => {
  if (!email || !password) { 
    return false;
  }

  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}

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

//* ~~~~~~~~~~ Get Urls ~~~~~~~~~~ //
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_index", templateVars);
});

// Make sure this is above ("/urls/:id")
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_new", templateVars);
});

//* ~~~~~~~~~~ Get => /urls/:shortURL ~~~~~~~~~~ //
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_show", templateVars);
});

//* ~~~~~~~~~~ Get => /u/:shortURL ~~~~~~~~~~ // 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]

  if (!longURL) {
    return res.send("Page not found!");
  }

  res.redirect(longURL);
});

//* ~~~~~~~~~~ Post Urls ~~~~~~~~~~ //
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();

  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

//* ~~~~~~~~~~ Delete Urls ~~~~~~~~~~ //
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

//* ~~~~~~~~~~ Update Urls ~~~~~~~~~~ //
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.shortURL;
  res.redirect("/urls")
});

//* ~~~~~~~~~~ Get Login ~~~~~~~~~~ //
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  }
  res.render("urls_login", templateVars);
}); 

//* ~~~~~~~~~~ Post Login ~~~~~~~~~~ //
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = checkPassword(email, password, users);
  if (!user) {
    res.status(403).send("Invalid credentials");
  } else {
    res.cookie("user_id", user.id);
    res.redirect('/urls');
  } 
});


//* ~~~~~~~~~~ Post Logout ~~~~~~~~~~ //
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
 });

//* ~~~~~~~~~~ GET Register ~~~~~~~~~~ //
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  }

  res.render("urls_registration", templateVars);
});

//* ~~~~~~~~~~ POST Register ~~~~~~~~~~ //
app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  const registeredUser = emailExists(req.body.email, req.body.password, users);

  if (registeredUser) {
    res.send(401);
  }

  users[user_id] = {
    id: user_id,
    email: req.body.email,
    password: req.body.password
  };

  res.cookie("user_id", user_id);
  res.redirect("/urls");
});