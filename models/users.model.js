const db = require("../db/connection");

exports.selectUsers = () => {
  const queryStr = "SELECT * FROM users";
  return db.query(queryStr).then((users) => {
    return users.rows;
  });
};
