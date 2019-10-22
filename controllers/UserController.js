const UserModel = require("../models/UserModel");


class UserController{
    constructor(){}

    async register(req,res){
        if(req.method == "GET"){
            res.render('user/register');
        }else{
            try {
                const user = await UserModel.save(req.body);
                console.log(user);
                return res.redirect('/auth');
            }
            catch (err) {
                return console.log(err);
            }
        }
    }
}



module.exports = new UserController();