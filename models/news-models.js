const db = require("../db/connection");

exports.selectTopics = () => {
  const queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleByID = (articleid) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleid])
    .then((result) => {
      const myArticle = result.rows;
      if (myArticle.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article with id: ${articleid} does not exist`,
          detail: `please enter valid article number`,
        });
      }
      return myArticle[0];
    });
};
