const {
  selectArticleByID,
  updateArticleByID,
  fetchComments,
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
