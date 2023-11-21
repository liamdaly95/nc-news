const { selectComments, insertComment } = require("../models/comments.models");
const { checkExists } = require("../models/utils.models");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([selectComments(article_id), checkExists("articles", "article_id", article_id)])
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username: author } = req.body;
  // if (!author) {
  //   Promise.reject({ status: 400, msg: "bad request" }).catch(next);
  // }
  insertComment(body, author, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
