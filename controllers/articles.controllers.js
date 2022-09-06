const {selectArticleById} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const {article_id} = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
