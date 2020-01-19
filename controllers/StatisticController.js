const Chart = require("chart.js");
const PromotedInscriptionModel = require("../models/PromotedInscriptionModel");
const PromotedGameModel = require("../models/PromotedGameModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");
const UserModel = require("../models/UserModel");

class StatisticController{
    constructor(){}

    //no estoy muy seguro de esta cabecera
    show(req,res){
        console.log("Show Statistics");
        //let numGender = getNumAthletesByGender();
        console.log("A renderizar graficas");
        res.render("statistic.twig",{prueba:[2478,3267,5734,784,433]});  //anhadir nuevos parametros necesarios para la vista
    }

    getNumAthletesByGender(){
        return UserModel.getNumAthletesByGender();
    }
}

module.exports = new StatisticController();