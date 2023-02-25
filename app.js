const express = require("express");
const cors = require("cors");

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleByID,
  patchArticleByID,
  getAllArticles,
  getArticleComments,
  postCommentByID,
} = require("./controllers/articles.controller");
const { getUsers, getUserByName } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getAPI, healthCheck } = require("./controllers/api.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", healthCheck);
app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:articleid", getArticleByID);
app.patch("/api/articles/:articleid", patchArticleByID);

app.get("/api/articles/:articleid/comments", getArticleComments);
app.post("/api/articles/:articleid/comments", postCommentByID);

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByName);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res, next) => {
  res.status(404).send({
    msg: "not found",
    detail: "invalid endpoint/method",
  });
});

//psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      msg: "bad request",
      detail: "invalid data type, please enter a valid data type",
    });
  }
  if (err.code === "23503") {
    res.status(404).send({
      msg: "not found",
      detail: "does the item exist?",
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
  console.log(err, "<<<<ERRRR");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
