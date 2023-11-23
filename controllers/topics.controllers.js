const { selecTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selecTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { description, slug } = req.body;
  insertTopic(description, slug)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
