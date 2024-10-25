require('../config/DataBase')
const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({

    username : String,
    email : String,
    password : String,
    role : { type : String, default : 'admin' },
    blockUser : [{
        accountid : { type : String, default : '' }
    }],


}, { collection : "admindata" });

module.exports = mongoose.model('admindata', AdminSchema);  