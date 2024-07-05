const { Router } = require("express");
const { usersController } = require("../controllers/userController");

const usersRouter = Router();

usersRouter.post("/register", usersController//add);
usersRouter.post("/login", usersController//add);

module.exports = { usersRouter };
