const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();
// lpZj7wr3OZJwo2kx  //pass

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
var moment = require("moment");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT} \n Mongo done`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const Customer = require("./models/customerSchema");
//GET Request
app.get("/", (req, res) => {
  Customer.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/edit/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      console.log("=================================");
      console.log(result);
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

//POST Request
app.post("/user/add.html", (req, res) => {
  console.log(req.body);

  Customer.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/search", async (req, res) => {
  console.log(req.body.searchText); //test with console

  await Customer.find({ firstName: req.body.searchText })
    .then((result) => {
      console.log(result);
      res.render("user/search", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

//PUT Requst
app.put("/edit/:id", (req, res) => {
  console.log(req.body);
  Customer.updateOne({ _id: req.params.id }, req.body)
    .then((params) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//DELETE Request
app.delete("/delete/:id", (req, res) => {
  Customer.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
