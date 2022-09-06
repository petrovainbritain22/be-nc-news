const express = require("express");
const {getTopics} = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({msg: "Internal server error"});
});

app.all("/*", (req, res) => {
  res.status(404).send({msg: "Route not found"});
});

module.exports = app;
