const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  let selectCommentsByArticleIdQueryStr = `SELECT comment_id, votes, created_at, author, body
  FROM comments 
  WHERE article_id = $1;`;

  return db
    .query(selectCommentsByArticleIdQueryStr, [article_id])
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
