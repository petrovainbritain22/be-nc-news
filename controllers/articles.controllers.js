const {sort} = require("../db/data/test-data/articles");
const {
  selectArticles,
  selectArticleById,
  updateArticleByVote,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const {topic, sort_by, order} = req.query;
  selectArticles(topic, sort_by, order)
    .then((articlesArray) => {
      res.status(200).send({articles: articlesArray});
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByVote = (req, res, next) => {
  const {article_id} = req.params;
  const {inc_votes} = req.body;
  updateArticleByVote(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({article: article});
    })
    .catch((err) => {
      next(err);
    });
};
