const db = require("../db/connection");

exports.selectArticleByID = (articleid) => {
  const queryStr = `SELECT articles.*,
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
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
    return result.rows[0];
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

exports.selectAllArticles = () => {
  let queryStr = `SELECT articles.*,
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id ORDER BY created_at DESC`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.selectArticleComments = (articleid) => {
  const queryStr = `SELECT * FROM comments WHERE article_id = $1`;
  const values = [articleid];

  return db.query(queryStr, values).then((result) => {
    return result.rows;
  });
};
