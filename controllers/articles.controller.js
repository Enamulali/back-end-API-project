const {
  selectArticleByID,
  updateArticleByID,
  selectAllArticles,
  selectArticleComments,
  insertCommentByID,
} = require("../models/articles.model");
const { checkIfTopicExists } = require("../models/topics.model");

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
  const { sort_by, order, topic } = req.query;
  const promises = [selectAllArticles(sort_by, order, topic)];
  if (topic) {
    promises.push(checkIfTopicExists(topic));
  }
  Promise.all(promises)
    .then(([result]) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { articleid } = req.params;

  Promise.all([selectArticleByID(articleid), selectArticleComments(articleid)])
    .then(([, result]) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByID = (req, res, next) => {
  const { articleid } = req.params;
  const { username: author, body } = req.body;

  insertCommentByID(author, body, articleid)
    .then((result) => {
      res.status(201).send({ addedComment: result });
    })
    .catch((err) => {
      next(err);
    });
};
