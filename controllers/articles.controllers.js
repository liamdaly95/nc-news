const { selectArticleById, selectArticles, updateVotes, insertArticle, removeArticle } = require("../models/articles.models");
const { checkExists } = require("../models/utils.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by = "created_at", order = "DESC", limit = 10, page = 1 } = req.query;
  const articlesPromises = [selectArticles(topic, sort_by, order, limit, page)];
  if (topic) {
    articlesPromises.push(checkExists("topics", "slug", topic));
  }
  Promise.all(articlesPromises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const {
    author,
    title,
    body,
    topic,
    article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
  } = req.body;
  const values = [author, title, body, topic, article_img_url];
  insertArticle(values)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id).then((result) => {
    res.status(204).send(result)
  })
  .catch(next)
};
