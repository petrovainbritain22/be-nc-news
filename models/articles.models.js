const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const selectArticleByIdQueryStr = `SELECT *
    FROM articles 
    WHERE article_id = $1;`;
  return db.query(selectArticleByIdQueryStr, [article_id]).then(({rows}) => {
    const noSelectedArticles = rows.length === 0;
    if (noSelectedArticles) {
      return Promise.reject({status: 404, msg: "Article not found"});
    } else {
      return rows[0];
    }
  });
};
exports.updateArticleByVote = (article_id, inc_votes) => {
  const updateArticleByVoteQueryStr = `UPDATE articles 
  SET votes = articles.votes + $1 
  WHERE article_id = $2 
  RETURNING *;`;

  const updateArticleByVoteVariables = [inc_votes, article_id];
  return db
    .query(updateArticleByVoteQueryStr, updateArticleByVoteVariables)
    .then(({rows}) => {
      return rows[0];
    });
};
