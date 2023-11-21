const express = require("express");
const { getTopics, getArticleById, getDocumentation, getArticles } = require("../controllers/controllers");
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("../error-handling/error-handling");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api",getDocumentation)
app.get("/api/articles",getArticles)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'path not found'})
})

app.use(handlePsqlErrors)
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;

