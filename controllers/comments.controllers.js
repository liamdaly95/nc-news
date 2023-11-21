const { selectComments } = require("../models/comments.models");
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
