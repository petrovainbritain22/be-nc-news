const db = require("../db/connection");

exports.selectArticles = (articleTopic) => {
  const selectArticlesQueryVariables = [];
  let selectArticlesQueryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, count (comment_id) as comment_count 
  FROM comments 
  RIGHT OUTER JOIN articles 
  ON comments.article_id = articles.article_id`;
  const toSelectByTopic = articleTopic !== undefined;
  if (toSelectByTopic) {
    selectArticlesQueryStr += ` WHERE articles.topic = $1`;
    selectArticlesQueryVariables.push(articleTopic);
  }
  selectArticlesQueryStr += ` GROUP BY articles.article_id, comments.article_id
  ORDER BY articles.created_at DESC;`;

  return db
    .query(selectArticlesQueryStr, selectArticlesQueryVariables)
    .then(({rows: articleRows, rowCount}) => {
      const noSelectedArticles = rowCount === 0;
      if (noSelectedArticles) {
        return Promise.all([
          articleRows,
          db.query(`SELECT * FROM topics WHERE slug = $1;`, [articleTopic]),
        ]);
      } else {
        return Promise.all([articleRows]);
      }
    })
    .then(([articleRows, topicResult]) => {
      const selectedArticles = articleRows.length > 0;
      if (selectedArticles) {
        return articleRows;
      } else if (!toSelectByTopic) {
        return Promise.reject({status: 404, msg: "Articles not found"});
      } else if (topicResult.rowCount > 0) {
        return Promise.reject({
          status: 404,
          msg: `Articles about ${articleTopic} not found`,
        });
      } else {
        return Promise.reject({
          status: 404,
          msg: `Topic not found`,
        });
      }
    });
};

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
