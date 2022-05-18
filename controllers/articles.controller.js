const {
  selectArticleByID,
  updateArticleByID,
  selectAllArticles,
  selectArticleComments,
} = require("../models/articles.model");

exports.getArticleByID = (req, res, next) => {
  const { articleid } = req.params;
  selectArticleByID(articleid)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByID = (req, res, next) => {
  const { articleid } = req.params;
  const { inc_votes } = req.body;
  updateArticleByID(inc_votes, articleid)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { articleid } = req.params;
  selectArticleComments(articleid)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};
