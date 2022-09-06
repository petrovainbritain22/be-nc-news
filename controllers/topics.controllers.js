const {selectTopics} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topicsArray) => {
    res.status(200).send({topics: topicsArray});
  });
};
