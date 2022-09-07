const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const selectArticleByIdQueryStr = `SELECT count (comment_id) as comment_count, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes
    FROM comments 
    RIGHT OUTER JOIN articles 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id, comments.article_id;`;
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
  const noVotesIncrement = inc_votes === undefined;
  if (noVotesIncrement) {
    return Promise.reject({status: 400, msg: "Missing required fields"});
  } else if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Incorrect type. Number is expected",
    });
  } else {
    const updateArticleByVoteQueryStr = `UPDATE articles 
  SET votes = articles.votes + $1 
  WHERE article_id = $2 
  RETURNING *;`;

    const updateArticleByVoteVariables = [inc_votes, article_id];
    return db
      .query(updateArticleByVoteQueryStr, updateArticleByVoteVariables)
      .then(({rows}) => {
        const noSelectedArticles = rows.length === 0;
        if (noSelectedArticles) {
          return Promise.reject({status: 404, msg: "Article not found"});
        } else {
          return rows[0];
        }
      });
  }
};
