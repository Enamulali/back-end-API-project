const express = require("express");
const { getTopics } = require("./controllers/news-controllers");

const app = express();

app.get("/api/topics", getTopics);

//custom errors
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found", detail: "inavlid endpoint/method" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg, detail: err.detail });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
