const db = require("../db/connection");
const format = require("pg-format");

exports.selectUsers = () => {
  const selectUsersQueryStr = format("SELECT * FROM users");
  return db.query(selectUsersQueryStr).then(({rows}) => rows);
};
