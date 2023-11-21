const express = require("express");
const { getArticleById, getArticles } = require("../controllers/articles.controllers");
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("../error-handling/error-handling");
const { getTopics } = require("../controllers/topics.controllers");
const { getDocumentation } = require("../controllers/documentation.controllers");
const { getComments } = require("../controllers/comments.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getDocumentation);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
