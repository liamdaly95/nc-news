const { selecTopics, selectArticleById, readDocumentation, selectArticles } = require("../models/models");

exports.getTopics = (req, res, next) => {
  selecTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getDocumentation = (req, res, next) => {
  readDocumentation()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};
