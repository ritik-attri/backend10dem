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
    collaboration:[{
        user_id:{
            type:String,
        },
        status:{
            type:Boolean,
            default:false
        },
    }],
    learningOutcome:{
        type:String,
    }, 
    price:{
        type:String,
        default:"free"
    },
    keyContribution:{
        type:String,
    },
    projectCover:{
        type:String
    },
    published:{
        type:Boolean,
        default: false
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
