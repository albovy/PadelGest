const PromotedInscriptionModel = require("../models/PromotedInscriptionModel");
const PromotedGameModel = require("../models/PromotedGameModel");
const BookModel = require("../models/BookModel");
const CourtModel = require("../models/CourtModel");

class PromotedInscriptionController{
    constructor(){}

    async showAll(req,res){
        const promos = await PromotedGameModel.findAll();
        res.render("promotedInscription/showAll", { promos: promos });
    }

    async add(req,res){
        try{
            
            const dateNow = Date.now();
            const promo = await PromotedGameModel.findById(req.params.id);
            if(promo.date < dateNow){
                req.flash("error","El partido promocionado ya se ha jugado.");
                await PromotedGameModel.delete(req.params.id);
                return res.redirect("/promotedInscription");
            }
            
            let data = {user_id: req.user.id, promoted_id: req.params.id};
            
            if(await PromotedInscriptionModel.findIfImAlreadyInscripted(data)>0){
                req.flash("error","Ya estás inscrito en este partido promocionado.");
                return res.redirect("/promotedInscription");
            }
            if(promo.numPlayers < 3){ //Solo hay dos apuntados al promocionado
                //console.log("Vamos bien");
                await PromotedInscriptionModel.add(data);
                const newData = {$set: {numPlayers: promo.numPlayers+=1}};
                await PromotedGameModel.incrementNumPlayers(req.params.id,newData);
                //console.log(a);
                return res.redirect("/promoted/showInscriptions");
            }else{ //Hay 3 apuntados al promo y se va a apuntar el cuarto, se efectua reserva si hay pista libre
                console.log("Prueba cuarto miembro promocionado");
                if(CourtModel.countCourts() == BookModel.countBooksOnDate()){
                    console.log("Salta el error de pistas no disponibles");
                    req.flash("error","No se ha podido efectuar la reserva.");
                    await PromotedGameModel.delete(req.params.id);
                    return res.redirect("/promotedInscription");
                }else if(promo.numPlayers==3){
                    const startDate = promo.date;
                    console.log("Vamos bien");
                    const booksOnDate = await BookModel.findByDate(startDate);
                    const arrOcuped = [];
                    booksOnDate.forEach(element => {
                        arrOcuped.add(element.court_id);
                    });
                    
                    const courtsAvailable = await CourtModel.findNotInRange(arrOcuped);
                    const courtAv = courtsAvailable[0]._id;
                    const endDate = new Date(new Date(new Date(startDate).getTime()+5400000));
                    
                    let data2 = {user_id: req.user.id, court_id: courtAv, startDate: startDate, endDate: endDate};
                    const book = await BookModel.add(data2);
                    await PromotedInscriptionModel.add(data);
                    const inc = {$set: {numPlayers: promo.numPlayers+=1}};
                    await PromotedGameModel.incrementNumPlayers(req.params.id,inc);
                    console.log(book);
                    console.log("Tiene pinta de que ha funcionao");
                    res.redirect("/book");
                }else{
                    console.log("4 personas inscritas ya");
                    req.flash("error","Ya hay 4 personas inscritas.");
                    return res.redirect("/promotedInscription");
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    async delete(req,res){
        try {
            const promo = await PromotedGameModel.findById(req.params.id);
            const dataa = {$set: {numPlayers: promo.numPlayers-=1}};
            
            await PromotedGameModel.incrementNumPlayers(req.params.id,dataa); //Es decrementar en verdad
            await PromotedInscriptionModel.deleteUser(req.params.id,req.user.id);
            res.redirect("/promoted/showInscriptions");
        } catch (err) {
            console.log("F");
        }
      }
}

module.exports = new PromotedInscriptionController();