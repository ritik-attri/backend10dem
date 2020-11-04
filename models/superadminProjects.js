const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superadminProjectSchema = Schema({
    title:{
        type:String,
        
    },
    summary:{
        type:String,
        
    },
    subject:{
        type:String,
       
    },
    grade:{
        type:String,
        
    },
    keywords:{
        type:String,
       
    },
    inquiryQuestion:{
        type:String,
        
    },
    learningOutcome:{
        type:String,
    }, 
    keyContribution:{
        type:String,
    },
    projectCover:{
        type:String
    },
    activity:[new mongoose.Schema({
        activity_title:{
            type:String,
            required:true
        },
        activity_desc:{
            type:String,
            required:true
        },
        attached_files:{
            type:Array,
        }
    })]

})
module.exports = mongoose.model('superadminProject', superadminProjectSchema);
