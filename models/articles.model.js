const db = require("../db/connection");

exports.selectArticleByID = (articleid) => {
  //change test
  //force comment_counter as INT type casting
  const queryStr = `SELECT articles.*,
  CAST(COUNT(comments.article_id) AS INT) AS comment_counter
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id 
  WHERE articles.article_id = $1 GROUP BY articles.article_id`;
  const values = [articleid];

  return db.query(queryStr, values).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `article with id: ${articleid} does not exist`,
        detail: `please enter valid article number`,
      });
    }
    return result.rows[0]; //parse comment_count
  });
};

exports.updateArticleByID = (inc_votes, articleid) => {
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  const values = [inc_votes, articleid];

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `bad request`,
      detail: `invalid data type, please enter a valid data type`,
    });
  }

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
