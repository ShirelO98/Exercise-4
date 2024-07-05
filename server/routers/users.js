const { Router } = require('express');
const { postRouterController } = require('../controllers/userController');

const postRouter = Router(); 

postRouter.post('/register', postRouterController.register);
postRouter.post('/login', postRouterController.login);

module.exports = postRouter;
