const db = require("../db/connection");

exports.selectArticleByID = (articleid) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleid])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `article with id: ${articleid} does not exist`,
          detail: `please enter valid article number`,
        });
      }
      return result.rows[0];
    });
};

exports.updateArticleByID = (inc_votes, articleid) => {
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  const values = [inc_votes, articleid];
  return db.query(queryStr, values).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `article with id: ${articleid} does not exist`,
        detail: `please enter valid article number`,
      });
    }

    return result.rows[0];
  });
};
