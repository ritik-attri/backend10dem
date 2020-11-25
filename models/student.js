const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema=Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
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
    projects_assigned:[{
        project_id:{
            type:String,
            required:true,
        },
        activities:[{
            type:Object
        }],
        status:{
            type:Boolean,
            default: false
        }
    }],
    notifications:[{
        message:String,
        time:Date,
        user_id:String,
        project_id:String
    }],
})
module.exports = mongoose.model('Student',StudentSchema);