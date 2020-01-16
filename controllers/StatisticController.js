const Chart = require("chart.js");
const PromotedInscriptionModel = require("../models/PromotedInscriptionModel");
const PromotedGameModel = require("../models/PromotedGameModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");
const UserModel = require("../models/UserModel");

class StatisticController{
    constructor(){}

    //no estoy muy seguro de esta cabecera
    show(res){
        console.log("Show Statistics");

        res.render("/statistic.twig");  //anhadir nuevos parametros necesarios para la vista
    }
}

module.exports = new StatisticController();