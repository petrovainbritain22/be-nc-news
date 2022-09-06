exports.handleCustomErrors = (err, req, res, next) => {
  const badRequestsCodes = ["22P02"];
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else if (badRequestsCodes.includes(err.code)) {
    res.status(400).send({msg: "Bad request"});
  } else {
    next(err);
  }
};
exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({msg: "Internal server error"});
};
