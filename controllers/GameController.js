const GameModel = require("../models/GameModel");
const ClashModel = require("../models/ClashModel");

class GameController {
  constructor() {}

  show(req,res){
    
  }
  async add(req,res){
    try{
      const clash = await ClashModel.findById(req.params.id);
      const date = req.body.date;

      if(date< Date.now()){
        throw err;
      }
    }catch(err){
      
    }
  }

}


module.exports = new GameController();