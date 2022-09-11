const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const {article_id} = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({comments});
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const postedComment = req.body;
  const {article_id} = req.params;
  insertCommentByArticleId(article_id, postedComment)
    .then((insertedComment) => {
      res.status(201).send({comment: insertedComment});
    })
    .catch(next);
};
exports.deleteCommentById = (req, res, next) => {
  const {comment_id} = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
