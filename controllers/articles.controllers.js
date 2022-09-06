const {
  selectArticleById,
  updateArticleByVote,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
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
      console.log(article);
      res.status(201).send({article: article});
    })
    .catch((err) => {
      next(err);
    });
};
