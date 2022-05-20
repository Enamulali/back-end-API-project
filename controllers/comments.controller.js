const {
  removeCommentById,
  checkIfCommentExists,
} = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  const promises = [
    checkIfCommentExists(comment_id),
    removeCommentById(comment_id),
  ];

  Promise.all(promises)
    .then(([, result]) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
