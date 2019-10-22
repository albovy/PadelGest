const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');

class AuthController{
    constructor(){}

    async authenticate(req,res){
        if(req.method == "GET"){
            res.render('user/login');
        }else{
            let user = UserModel.findOne(req.body.login);
    
            let valid = user.then((user) => {
                if (user)
                  return req.body.passwd == req.body.passwd;
                else
                  throw err;
              });
    
            try {
                const [user_2, valid_1] = await Promise.all([user, valid]);
                if (valid_1) {
                    let payload = { id: user_2._id, login: user_2.login };
                    console.log(user_2);
                    const token = jwt.sign(payload, 'keyboard cat 4 ever', { expiresIn: 129600 });
                    res.cookie('token', token);
                    return res.redirect('/prueba');
                }
                else {
                    throw err;
                }
            }
            catch (err) {
                return res.status(401);
            }
        }
    }

    retrieveTokenFromCookie(req){
        var token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'] ;
        if (token) {
            return token;
        } 
        
        return null;
    }
}

module.exports = new AuthController();