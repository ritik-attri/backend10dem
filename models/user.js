const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema({
    username:{
        type: String,
        required: true,
      
    },
    email: {      
        type: String,
        required:true,
        unique: true
    },
    social_email:{
        type: String,
        unique: true
    },
    password: {   
        type: String,
        minlength: 4,
        required:true
    },
    social_password:{
        type:String,
    },
    Role:{
        is10DemProuser:{
            type:Boolean,
            default:false
        },
        isNPOrg:{
            type:Boolean,
            default:false
        },
        isOrg:{
            type:Boolean,
            default:false
        },
        isEducator:{
            type:Boolean,
            default:false
        }
    },
    Role_object_id:{
        type:String,
        default:''
    },
    notifications:[{
        message:String,
        time:Date,
        user_id:String,
        project_id:String
    }],
    Bookmarks:[{
        type:String,
    }],
    Projects:[{
        type:String,
    }],
    user10demprojects:[{
        type:String,
    }],
    global_cllb:[{
        user_id:String,
        project_id:String
    }],
    
});



module.exports = mongoose.model('User', userSchema);
