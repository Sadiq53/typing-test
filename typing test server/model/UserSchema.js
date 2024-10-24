require('../config/DataBase')
const mongoose = require('mongoose');
const { type } = require('os');

const UserSchema = mongoose.Schema({

    username : String,
    email : String,
    password : { type : String, default : '' },
    createdate : Date,
    accountid : String,
    highestrecord1min : {
        easy : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        },
        medium : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        },
        hard : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        }
    },
    highestrecord3min : {
        easy : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        },
        medium : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        },
        hard : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        }
    },
    highestrecord5min : {
        easy : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        },
        medium : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        },
        hard : {
            wpm : { type : Number, default : 0 },
            acc : { type : Number, default : 0 },
            consis : { type : Number, default : 0 },
            combination : { type : Number, default : 0 },
            id : { type : String, default : '' }
        }
    },
    profileimage : {
        originalname : { type : String, default : '' },
        newname : { type : String, default : '' },
        filepath : { type : String, default : '' },
        updatedat : { type : Date, default : new Date() },
    },
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