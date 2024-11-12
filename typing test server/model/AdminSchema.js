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
    blog : [
        {
            title : { type : String, default : '' },
            content : { type : String, default : '' },
            status : { type : String, default : '' },
            description : { type : String, default : '' },
            category : { type : Array, default : [] },
            tags : { type : Array, default : [] },
            createdat : { type : Date, default : Date.now() },
            featuredImage : {
                name : { type : String, default : '' },
                path : { type : String, default : '' }
            }
        }
    ],
    blogCategory : { type : Array, default : [] }


}, { collection : "admindata" });

module.exports = mongoose.model('admindata', AdminSchema);  