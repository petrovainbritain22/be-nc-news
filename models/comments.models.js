const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id) => {
  let queryString = `SELECT comment_id, votes, created_at, author, body
  FROM comments 
  WHERE article_id = $1;`;

  return db
    .query(queryString, [article_id])
    .then(({rows: commentRows, rowCount}) => {
      const noSelectedComments = rowCount === 0;
      if (noSelectedComments) {
        return Promise.all([
          commentRows,
          db.query(`SELECT * FROM articles WHERE article_id = $1;`, [
            article_id,
          ]),
        ]);
      } else {
        return Promise.all([commentRows]);
      }
    })
    .then(([commentRows, articleResult]) => {
      if (articleResult && articleResult.rowCount === 0) {
        return Promise.reject({status: 404, msg: "Article not found"});
      } else {
        return commentRows;
      }
    });
};

exports.insertCommentByArticleId = (article_id, postedComment) => {
  const variables = [article_id, postedComment.username, postedComment.body];

  if (variables.includes(undefined)) {
    return Promise.reject({status: 400, msg: "Required fields are missed"});
  }

  const queryString = `INSERT INTO comments
  (article_id, author, body)
  VALUES
  %L
  RETURNING *;`;
  const formattedQueryString = format(queryString, [variables]);
  return db.query(formattedQueryString).then(({rows}) => {
    return rows[0];
  });
};

exports.removeCommentById = (comment_id) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;

  return db.query(queryString, [comment_id]).then(({rowCount}) => {
    if (rowCount === 0) {
      return Promise.reject({status: 404, msg: "Comment not found"});
    }
  });
};
