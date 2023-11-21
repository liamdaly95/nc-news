const { readDocumentation } = require("../models/documentation.models");

exports.getDocumentation = (req, res, next) => {
  readDocumentation()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};
