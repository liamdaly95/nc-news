const express = require("express");
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("../error-handling/error-handling");
const apiRouter = require("../routes/api-router");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
