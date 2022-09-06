const express = require("express");
const {getArticles} = require("./controllers/articles.controllers");
const {
  handleCustomErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");
const {getTopics} = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticles);

app.all("/*", (req, res) => {
  res.status(404).send({msg: "Route not found"});
});

app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
