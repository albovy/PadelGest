const Chart = require("chart.js");
const BookModel = require("../models/BookModel");
const UserModel = require("../models/UserModel");
const InscriptionModel = require("../models/InscriptionModel");

class StatisticController{
    constructor(){}


    async show(req,res){
        console.log("Show Statistics");

        //Numero de atletas por genero
        let numWomen = await UserModel.findWomen();
        let numMen = await UserModel.findMen();
        console.log("arrayGender: ",[numWomen,numMen]);

        //Reservas por dia de la semana
        console.log("hola");
        let arrayUserBooks = await BookModel.findAllUserBooks();
        let arrayDaysTotal = [0,0,0,0,0,0,0];  //El 0 es el domingo, el 1 el lunes...
        let acumBooks = 0;
        console.log("ArrayUserBooks: ", " length: ",arrayUserBooks.length);
            arrayUserBooks.map(async element => {
                console.log(element.startDate);
                console.log("dia: ", element.startDate.getDay());
                arrayDaysTotal[element.startDate.getDay()]++;
                acumBooks +=1 ;
            });
        console.log(arrayDaysTotal);
        console.log(acumBooks);
        for(let i=0;i<arrayDaysTotal.length;i++){
            arrayDaysTotal[i] = arrayDaysTotal[i]/acumBooks;
        }
        console.log(arrayDaysTotal);

        //Datos de Reservas de usuarios
        let userBPerCent;
        let systemBPerCent;
        try{
            console.log("try");
            let systemBooks = await BookModel.countSystemBooks();
            console.log("system: ", systemBooks);
            let userBooks = await BookModel.countUserBooks();
            console.log("user: ", userBooks);
            
            userBPerCent = userBooks/(userBooks+systemBooks);
            systemBPerCent = systemBooks/(userBooks+systemBooks);
        }catch(err){
            console.log(err);
        }

        //Inscripciones medias por nivel
        let niveles = [0,0,0];  //Actualmente 3 niveles de jugadores
        let inscripciones = await InscriptionModel.findAll();
        console.log(inscripciones.length);
            inscripciones.map(async inscripcion =>{
                switch(inscripcion.category){
                    case 1: niveles[0]++;
                            break;
                    case 2: niveles[1]++;
                            break;
                    case 3: niveles[2]++;
                            break;
                    default: console.log("Expande el array de niveles amegoh");
                            break;
                    
                }
            });   
        for(let j;j<niveles.length;j++){
            niveles[j]/inscripciones.length;
        }
        console.log("Niveles" ,niveles);
        console.log("A renderizar graficas");
        res.render(
            "statistic.twig",{atletas:[numWomen,numMen],
            reservas:[userBPerCent,systemBPerCent],
            reservasPorDia:arrayDaysTotal,
            nivelesTorneo:niveles,user:req.user}
        );  //anhadir nuevos parametros necesarios para la vista
    }

}

module.exports = new StatisticController();