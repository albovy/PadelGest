const ClashModel = require("../models/ClashModel");
const CompetitionModel = require("../models/CompetitionModel");


class ClashController{
    constructor(){
    }

    async show(req,res){
        console.log("showClash");
        const myClash = await ClashModel.findByUser(req.user.id);
        res.render("clash/showAll",{clashes : myClash});
    }

    async showTournament(req,res){
        console.log("showTournament");
        const comp = await CompetitionModel.findByTournament(req.params.id);
        console.log(comp._id);
        const myClash = await ClashModel.findByUserAndCompetition(comp._id,req.user.id);
        console.log(comp);
        console.log("prueba");
        res.render("clash/showAll",{clashes : myClash});
    }

    
}

module.exports = new ClashController();