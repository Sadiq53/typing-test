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
    paragraphs: {
        Min1: {
            easy: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            medium: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            hard: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ]
        },
        Min3: {
            easy: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            medium: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            hard: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ]
        },
        Min5: {
            easy: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            medium: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            hard: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ]
        },
    },


}, { collection : "admindata" });

module.exports = mongoose.model('admindata', AdminSchema);  