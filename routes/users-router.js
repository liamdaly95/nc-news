const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/users.controllers");

usersRouter.get("/",getUsers)
usersRouter.get("/:username",getUserByUsername)

module.exports = usersRouter;