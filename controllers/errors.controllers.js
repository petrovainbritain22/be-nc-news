exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlErrorsObject = {
    "22P02": "Invalid input",
    23502: "Required fields are missed",
  };
  if (err.code === "23503") {
    const notExistMessagesObject = {
      author: "User with this name does not exist",
      article_id: "Article does not exist",
    };
    const columnName = err.detail.match(/Key \((.*)\)=.*/)[1];

    res.status(400).send({msg: notExistMessagesObject[columnName]});
  } else if (psqlErrorsObject[err.code]) {
    res.status(400).send({msg: psqlErrorsObject[err.code]});
  } else next(err);
};
exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({msg: "Internal server error"});
};
