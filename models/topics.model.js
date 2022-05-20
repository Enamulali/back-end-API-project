const db = require("../db/connection");

exports.selectTopics = () => {
  const queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((topics) => {
    return topics.rows;
  });
};

exports.checkIfTopicExists = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `topic: ${topic} does not exist`,
          detail: "please provide a different topic",
        });
      }
    });
};
