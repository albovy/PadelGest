const express = require('express');
const router = express.Router();

const user = require('../controllers/UserController.js');

/* GET users listing. */
router.get('/login',user.login);
router.post('/login',user.login);

router.get('/register',user.register);
router.post('/register',user.register);

//router.get('/edit:id',user.edit);

module.exports = router;
