exports.handlePsqlErrors = (err, req, res, next) => {
  const badRequestErrors = ["22P02", "23502"];
  const notFoundErrors = ["23503"]
  if (badRequestErrors.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else if (notFoundErrors.includes(err.code)) {
    res.status(404).send({msg: "not found"})
  }
  else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "internal server error" });
};
