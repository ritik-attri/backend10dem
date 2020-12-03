const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submittedSchema = Schema({
    project_id:{
        type:String,
        
    },
    activities:[
        new mongoose.Schema({
            activity_number:{
                type:String
            },
            attached_files:[{
                type:Object
            }],
            comments:{
                type:String
            }
        })
    ],
    by:{
        type:String
    },
    to:{
        type:String
    }
})

module.exports = mongoose.model('submittedProjects', submittedSchema);