const express = require("express");
const {
  getArticles,
  getArticleById,
  patchArticleByVote,
} = require("./controllers/articles.controllers");
const {getCommentsByArticleId} = require("./controllers/comments.controllers");
const {
  handleCustomErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");
const {getTopics} = require("./controllers/topics.controllers");
const {getUsers} = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.get("/api/topics", getTopics);

app.patch("/api/articles/:article_id", patchArticleByVote);

app.all("/*", (req, res) => {
  res.status(404).send({msg: "Route not found"});
});

app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
