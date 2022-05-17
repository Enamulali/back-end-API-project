const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleByID,
  patchArticleByID,
  getArticlesWithComments,
} = require("./controllers/articles.controller");

const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleid", getArticleByID);
app.patch("/api/articles/:articleid", patchArticleByID);

app.get("/api/users", getUsers);

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
  if (err.status) {
    res.status(err.status).send({ msg: err.msg, detail: err.detail });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
