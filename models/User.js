const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
    login: {type : String, required: true, unique: true},
    passwd: {type:String, required: true},
    name: {type: String, required: true, max: 100},
    dni: {type: String, required: true, max: 9},
    genero: { type: String, required: true}
});
 
module.exports = mongoose.model('User', UserSchema);