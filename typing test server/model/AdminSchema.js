require('../config/DataBase')
const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({

    name : String,
    email : String,
    contact : String,
    password : String

}, { collection : "admindata" });

module.exports = mongoose.model('admindata', AdminSchema);  