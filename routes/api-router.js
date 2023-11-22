const apiRouter = require("express").Router();
const { getDocumentation } = require("../controllers/documentation.controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.use("/topics", topicsRouter)
apiRouter.use("/users",usersRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/articles",articlesRouter)


apiRouter.get("/", getDocumentation);

module.exports = apiRouter;
