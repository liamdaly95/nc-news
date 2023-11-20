const express = require("express");
const { getTopics } = require("../controllers/controllers");

const app = express()

app.get("/api/topics",getTopics)

module.exports = app
