const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const classesSchema=Schema({
    created_by_id:{
        type:String,
        required:true
    },
    grade:{
        type:Number,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    classname:{
        type:String,
    },
    students:[{
        type:String,
    }],
    org_name:{
        type:String,
    },
    projects:[{
        type:Object,
    }],
    color:{
        type:String,
    }
});
module.exports = mongoose.model('classes',classesSchema);