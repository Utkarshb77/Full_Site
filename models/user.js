const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose').default;


const userschema = new Schema({
    email:{
        type:String,
        required:true,
    }
});
// passport-local-mongoose username , Hashing , salting and hashpassword automatically karwa deta h , hum usko mention naa kare model mai toh bhi.
userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model('User' , userschema);