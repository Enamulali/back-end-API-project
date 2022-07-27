const db = require("../db/connection");

exports.selectUsers = () => {
  const queryStr = "SELECT * FROM users";
  return db.query(queryStr).then((users) => {
    return users.rows;
  });
};

exports.selectUsersByName = (username) => {
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  const values = [username];

  return db.query(queryStr, values).then((result) => {
    return result.rows[0];
  });
};
