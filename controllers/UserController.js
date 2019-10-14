const User = require("../models/User");

const userController = {};

userController.login = (req,res) =>{
    if(req.method == "GET"){
        res.render('user/login');
    }else{
        User.findOne({login: req.body.login, passwd: req.body.passwd}).exec((err,user) =>{
            if( err ){ console.log('Error: ', err); return ; }

            console.log(user);
        });
    }
}

userController.register = (req,res) =>{
    if(req.method == "GET"){
        res.render('user/register');
    }else{
        const user = new User(req.body);
        user.save((err)=>{
            if( err ){ 
                console.log('Error: ', err); 
                return res.redirect('/user/register') ; 
            }
            console.log("Successfully created a user. :)");
        
            res.redirect('/user/login');
        });
    }
}




module.exports = userController