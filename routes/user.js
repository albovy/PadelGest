const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController.js');

router.get('/register', userController.register);
router.post('/register', userController.register);

//router.get('/edit:id',user.edit);

module.exports = router;
