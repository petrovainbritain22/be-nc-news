const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  const selectTopicsQueryStr = format("SELECT * FROM topics");
  return db.query(selectTopicsQueryStr).then(({rows}) => rows);
};
