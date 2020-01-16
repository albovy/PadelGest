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
        var barChartExample = this.generateBars("bar-chart-example");
        console.log("A renderizar graficas");
        res.render("/statistic.twig");  //anhadir nuevos parametros necesarios para la vista
    }

    generateBars(canvasId){
        // Bar chart 
        new Chart(document.getElementById(canvasId), {
            type: 'bar',
            data: {
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [
                {
                label: "Population (millions)",
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                data: [2478,5267,734,784,433]
                }
            ]
            },
            options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
            }
            }
        });
    }
}

module.exports = new StatisticController();