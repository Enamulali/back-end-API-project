const express = require("express");
const { getTopics, getArticleByID } = require("./controllers/news-controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleid", getArticleByID);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found", detail: "invalid endpoint/method" });
});

//psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      msg: "bad request",
      detail: "invalid data type, please enter a valid data type",
    });
  } else next(err);
});

//custom error handler
app.use((err, req, res, next) => {
  if (err.status && err.msg && err.detail) {
    res.status(err.status).send({ msg: err.msg, detail: err.detail });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
