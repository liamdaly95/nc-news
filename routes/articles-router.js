const { getArticleById, getArticles, patchArticle } = require("../controllers/articles.controllers");
const { getComments, postComment } = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = articlesRouter;
