const { selectArticleByID } = require("../models/articles.model");

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
