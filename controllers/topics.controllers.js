const {selectTopics} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((selectResult) => {
    res.status(200).send(selectResult);
  });
};
