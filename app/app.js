const express = require("express");
const { getTopics } = require("../controllers/controllers");
const { handleServerErrors } = require("../error-handling/error-handling");

const app = express()

app.get("/api/topics",getTopics)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'path not found'})
})

app.use(handleServerErrors)

module.exports = app
