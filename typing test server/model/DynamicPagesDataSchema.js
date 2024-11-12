require('../config/DataBase')
const mongoose = require('mongoose')

const DynamicPagesDataSchema = mongoose.Schema({

    termsCondition : {
        createdat : { type: Date, default: '' },
        title : { type : String, default : '' },
        content : { type : String, default : '' },
    },
    privacyPolicy : {
        createdat : { type: Date, default: '' },
        title : { type : String, default : '' },
        content : { type : String, default : '' },
    },
    about : {
        createdat : { type: Date, default: '' },
        metaData : [
            {
                title : { type : String, default : '' },
                content : { type : String, default : '' },
                imageUrl : { type : String, default : '' },
                button : {
                    title : { type : String, default : '' },
                    url : { type : String, default : '' },
                }
            }
        ]
    }

}, { collection : "dynamiPages" });

module.exports = mongoose.model('dynamiPages', DynamicPagesDataSchema);  