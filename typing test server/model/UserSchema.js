require('../config/DataBase')
const mongoose = require('mongoose');
const { type } = require('os');

const UserSchema = mongoose.Schema({

    username : String,
    email : String,
    password : String,
    createdate : Date,
    accountid : String,
    top1minavg : {
        all : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        easy : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        medium : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        hard : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
    },
    top3minavg : {
        all : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        easy : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        medium : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        hard : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
    },
    top5minavg : {
        all : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        easy : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        medium : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
        hard : {
            avgwpm : { type : Number, default : 0 },
            avgacc : { type : Number, default : 0 },
            avgconsis : { type : Number, default : 0 },
        },
    },
    match_1 : [{ 
        accuracy : { type : Array, default : [] },
        consistency : { type : Array, default : [] },
        wpm : { type : Array, default : [] },
        avgwpm : { type : Number, default : 0 },
        avgacc : { type : Number, default : 0 },
        avgconsis : { type : Number, default : 0 },
        matchdate : { type : Date, default : '' },
        time : { type : Number, default : 0 },
        level : { type : String, default : '' },
        characters : { 
            correct : { type : String, default : '' },
            incorrect : { type : String, default : '' },
            extra : { type : String, default : '' },
            missed : { type : String, default : '' },
        },
    }],
    match_3 : [{ 
        accuracy : { type : Array, default : [] },
        consistency : { type : Array, default : [] },
        wpm : { type : Array, default : [] },
        avgwpm : { type : Number, default : 0 },
        avgacc : { type : Number, default : 0 },
        avgconsis : { type : Number, default : 0 },
        matchdate : { type : Date, default : '' },
        time : { type : Number, default : 0 },
        level : { type : String, default : '' },
        characters : { 
            correct : { type : String, default : '' },
            incorrect : { type : String, default : '' },
            extra : { type : String, default : '' },
            missed : { type : String, default : '' },
        },
    }],
    match_5 : [{ 
        accuracy : { type : Array, default : [] },
        consistency : { type : Array, default : [] },
        wpm : { type : Array, default : [] },
        avgwpm : { type : Number, default : 0 },
        avgacc : { type : Number, default : 0 },
        avgconsis : { type : Number, default : 0 },
        matchdate : { type : Date, default : '' },
        time : { type : Number, default : 0 },
        level : { type : String, default : '' },
        characters : { 
            correct : { type : String, default : '' },
            incorrect : { type : String, default : '' },
            extra : { type : String, default : '' },
            missed : { type : String, default : '' },
        },
    }],

}, { collection : "userdata" });

module.exports = mongoose.model('userdata', UserSchema);