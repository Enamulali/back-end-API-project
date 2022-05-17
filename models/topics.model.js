const db = require("../db/connection");

exports.selectTopics = () => {
  const queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((topics) => {
    return topics.rows;
  });
};
