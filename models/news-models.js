const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("Hello");
  const queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((topics) => {
    return topics.rows;
  });
};
