const db = require("../db/connection");

exports.checkIfCommentExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `comment: ${comment_id} does not exist`,
          detail: "please try again",
        });
      }
    });
};

exports.removeCommentById = (comment_id) => {
  const queryStr = `DELETE FROM comments WHERE comment_id = $1`;
  const values = [comment_id];
  return db.query(queryStr, values);
};
