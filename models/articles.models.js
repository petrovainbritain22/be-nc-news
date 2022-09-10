const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticles = (
  articleTopic,
  sortColumn = "created_at",
  sortOrder = "DESC"
) => {
  const queryVariables = [];
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, count (comment_id) as comment_count 
  FROM comments 
  RIGHT OUTER JOIN articles 
  ON comments.article_id = articles.article_id`;

  if (articleTopic) {
    queryStr += ` WHERE articles.topic = %L`;
    queryVariables.push(articleTopic);
  }
  queryStr += ` GROUP BY articles.article_id, comments.article_id
  ORDER BY %I %s;`;

  queryVariables.push(sortColumn);
  const isValidOrder = /^asc|desc$/.test(sortOrder);
  if (!isValidOrder) sortOrder = "DESC";
  queryVariables.push(sortOrder.toUpperCase());

  const formattedQueryString = format(queryStr, ...queryVariables);
  return db
    .query(formattedQueryString)
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
      const areSelectedArticles = articleRows.length > 0;
      if (areSelectedArticles) {
        articleRows.forEach((article) => {
          article.comment_count = parseInt(article.comment_count);
        });
        return articleRows;
      } else if (!articleTopic) {
        return Promise.reject({status: 404, msg: "Articles not found"});
      } else if (topicResult.rowCount > 0) {
        return articleRows;
      } else {
        return Promise.reject({
          status: 404,
          msg: `Topic not found`,
        });
      }
    });
};

exports.selectArticleById = (article_id) => {
  const queryStr = `SELECT count (comment_id) as comment_count, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes
    FROM comments 
    RIGHT OUTER JOIN articles 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id, comments.article_id;`;
  return db.query(queryStr, [article_id]).then(({rows}) => {
    const noSelectedArticles = rows.length === 0;
    if (noSelectedArticles) {
      return Promise.reject({status: 404, msg: "Article not found"});
    } else {
      const article = rows[0];
      article.comment_count = parseInt(article.comment_count);
      return article;
    }
  });
};
exports.updateArticleByVote = (article_id, inc_votes) => {
  const noVotesIncrement = inc_votes === undefined;
  if (noVotesIncrement) {
    return Promise.reject({status: 400, msg: "Required fields are missed"});
  } else if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Incorrect type. Number is expected",
    });
  } else {
    const queryStr = `UPDATE articles 
  SET votes = articles.votes + $1 
  WHERE article_id = $2 
  RETURNING *;`;

    const queryVariables = [inc_votes, article_id];
    return db.query(queryStr, queryVariables).then(({rows}) => {
      const noSelectedArticles = rows.length === 0;
      if (noSelectedArticles) {
        return Promise.reject({status: 404, msg: "Article not found"});
      } else {
        return rows[0];
      }
    });
  }
};
