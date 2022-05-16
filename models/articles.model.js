const db = require("../db/connection");

exports.selectArticleByID = (articleid) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleid])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article with id: ${articleid} does not exist`,
          detail: `please enter valid article number`,
        });
      }
      return result.rows[0];
    });
};
