const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const submittedProjects = require("./Submittedactivities")
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
        status:{
            type:Boolean,
            default: false
        },
        by:{
            type: String
        },
        activities:[{
            activity_number:String,
            startdate: Date,
            enddate:Date,
            status:{
                type:Boolean,
                default:false
            }
        }]
    }],
    notifications:[{
        message:String,
        time:Date,
        user_id:String,
        project_id:String
    }],
    submitted_activities:[{ type: mongoose.Schema.ObjectId, ref: 'submittedProjects' }]
})
module.exports = mongoose.model('Student',StudentSchema);