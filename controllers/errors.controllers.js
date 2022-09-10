exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlErrorsObject = {
    "22P02": "Invalid input",
    23503: {
      author: "User with this name does not exist",
      article_id: "Article does not exist",
    },
  };
  let errorMsg = psqlErrorsObject[err.code];
  if (err.code === "23503") {
    const columnName = err.detail.match(/Key \((.*)\)=.*/)[1];
    res.status(404).send({msg: errorMsg[columnName]});
  } else if (errorMsg) {
    res.status(400).send({msg: errorMsg});
  } else next(err);
};
exports.handle500Errors = (err, req, res, next) => {
  console.log(err, " << err 500");
  res.status(500).send({msg: "Internal server error"});
};
