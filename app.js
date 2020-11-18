const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors')
const app = express();
const session = require('express-session');
const https = require('https');
const axios = require('axios');
const util = require('util');
const nodemailer = require('nodemailer');
const request= require('request');
var google = require('googleapis');
var fs = require('fs-extra');
var xlsxreader = require('xlsx-to-json-lc');
var path = require('path');
var multer = require('multer');
app.set('views','./views');
app.use('/public',express.static('./public')); //Serves resources from public folder
app.set('view engine','ejs');


app.use(cors());
app.use(express.json());


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
  secret:'nothingnjwfownfwnfo',
  saveUninitialized:false,
  resave:false,
  
}))
var mail=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'10demdeveloper@gmail.com',
    pass:'developer123@'
  }
});
var storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/uploads');
  },
  filename:(req,file,cb)=>{
    // let ext = ''; 
    // if (file.originalname.split(".").length>1) 
    //     ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null,file.originalname+'-'+Date.now())
  }
})
var upload = multer({storage:storage});
/*################################## 
  ##Setting up connection to Mongo## 
  ##################################*/
const googleConfig={
  clientID:'850762646572-s418sekf7imkalnn764bg56odhluavuf.apps.googleusercontent.com',
  clientSecret:'A0GJbsoYPh9NyB9_9vOe5Idu',
  redirect:'http://localhost:3000/home/'
}
const mongoose = require('mongoose');
const user = require('./models/user');
const superadminProject = require('./models/superadminProjects')
const educatoror10dempro = require('./models/10demprooreducator');
const PorNPORG = require('./models/PorNPORG');
const classes = require('./models/classes');
const Student = require('./models/student');
const project = require('./models/project');
const blog = require('./models/blog');
const { restart } = require('nodemon');
const { profile, count } = require('console');
const { ftruncate } = require('fs');
const superadminProjects = require('./models/superadminProjects');
const internetConnected = require("check-internet-connected")
mongoose.connect('mongodb+srv://ritik:BIGGBOss12@cluster0.m96r8.gcp.mongodb.net/testing?retryWrites=true&w=majority',{
                useNewUrlParser:true,
                useCreateIndex:true,
                useUnifiedTopology:true,
                useFindAndModify:false,
                }).then(()=>{
                        console.log('connected to db and public directory in' +__dirname + '/public');
                        }).catch(err=>{
                        console.log('error'.err);
                        res.render("somethingWrong",{error:err})
                        });
var sess={};                         
/*#################################### 
  #########Sign in sign up req######## 
  #################################### */
app.get('/',function(req,res){
    sess={};
    internetConnected().then(result=>{
      res.render('signin');
    })
    .catch(err=>{
      res.render("noInternet")
    })
})
app.get('/signup/:either',function(req,res){
    console.log(req.params.either);
    internetConnected().then(result=>{
      res.render('signup');
    })
    .catch(err=>{
      res.render("noInternet")
    })
})

/*#################################### 
  ######G,L,F API Calls###############
  ####################################*/
/*app.get('/googlesignin',function(req,res){
  https.get('https://www.linkedin.com/oauth/v2/authorization')
})*/
/*#################################### 
  Resolving Linkedin API under G,L,F API 
  ####################################*/
/*app.get('/savinglinkedinprofile',function(req,res){
  console.log(req.query.code);
  var details={
    grand_type:'authorization_code',
    code:req.query.code,
    redirect_uri:'http://localhost:3000/savinglinkedinprofile',
    client_id:'86mhc0x8z0bc4e',
    client_secret:'ddIOAumv97ylrBIE'
  }
  url='https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code='+req.query.code+'&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fsavinglinkedinprofile&client_id=86mhc0x8z0bc4e&client_secret=ddIOAumv97ylrBIE';
  request.post(url,(error,resp,body)=>{
    if(error){
      console.log('Error is : '+error);
    }
    else{
      var access_tok=JSON.parse(body).access_token;
      console.log('This is the access-token'+access_tok);
      request.get('https://api.linkedin.com/v2/me?oauth2_access_token='+access_tok,(err,resps,bodys)=>{
        if(err){
          console.log(err.body);
        }else{
          var profiledata = JSON.parse(bodys);
          let namee=profiledata.localizedFirstName+' '+profiledata.localizedLastName;
          let emaill=profiledata.id;
          let passs=profiledata.id;
          console.log(namee);
          console.log(emaill);
          console.log(passs);
          if(emaill==undefined){
            res.send('Please login to LinkedIn');
          }else{
          user.find({email:emaill,id:passs},function(err,user){
            console.log(user)
            if(user[0]==undefined){
              console.log('need to save data to mongo');
              request.post('http://localhost:3000/savedatatomongo/'+1+' '+namee+' '+emaill);
            }
            else{
              console.log(user);
              sess=req.session;
              sess.user_data={user:user[0]};
              console.log('Going to home page!');
              res.redirect('/home/');
            }
          })
        }
        }
      })
    }
  })
})*/
/*#################################### 
  ############sign up################# 
  ####################################*/
app.post('/savedatatomongo/:id',function(req,res){
    console.log(req.params.id);
    if(req.params.id=='0'){
      console.log('inside savedatatomongo: '+util.inspect(req.body));
        let obj={
          username:req.body.name,
          email:req.body.email,
          social_email:req.body.email,
          password:req.body.pass
        }
        user.create(obj,function(err,user){
          if(err){
            console.log('There has been an error: '+err);
            res.render("somethingWrong",{error:err});
          }else{
            sess=req.session;
            sess.user_data={user:user};
            console.log(user);
            console.log(sess.user_data);
            console.log('User was created: '+user);
            var mailOptions = {
              from: '10demdeveloper@gmail.com',
              to: req.body.email,
              subject: 'Thank you for logging into 10 dem Education!',
              text: 'Here is your email:- '+req.body.email+' and your password is:- '+req.body.pass
            };
            
            mail.sendMail(mailOptions, function(error, info){
              if (error) {
                res.render("somethingWrong",{error:error})
              } else {
                console.log('Email sent: ' + info.response);
                res.redirect('/home/');
              }
            });
            
          }
        })
    }
    else{
      console.log('For social login only!');
      //here will go the social login 
    }
})
/*#################################### 
  ############SIGN IN################# 
  ####################################*/
app.post('/checkdata/:id',function(req,res){
  console.log(req.params.id);
  if(req.params.id=='0'){
    let obj={
      email:req.body.email,
      password:req.body.pass
    }
    console.log(req.body)
    user.find(obj,function(err,user){
      console.log('user is'+user[0]);
      if(err||user[0]==undefined){
        sess.req=session;
        sess.user_data={user:user[0],role_Data:null};
        res.redirect('/superadmin/dashboard');
      }
      else if(user[0].Role.is10DemProuser==true&&user[0].Role.isEducator==true&&user[0].Role.isNPOrg==true&&user[0].Role.isOrg){
        console.log('Cant find user so redirecting: '+err);
        res.redirect('/');
      }else{
        console.log(user[0]);
        if(user[0].Role.is10DemProuser==true||user[0].Role.isEducator==true){
          console.log('getting in educator');
          educatoror10dempro.find({_id:user[0].Role_object_id},function(err,role){
            if(err){
              console.log('Cant find educator or 10Dem pro user because: ' + err);
            }else{
              sess.req=session;
              sess.user_data={user:user[0],role_Data:role[0]};
              res.redirect('/home/');
            }
          })
        }
        else if(user[0].Role.isNPOrg==true||user[0].Role.isOrg==true){
          console.log('getting in nporg thing');
          PorNPORG.find({_id:user[0].Role_object_id},function(err,role){
            if(err){
              console.log('Cant find Non profit org because: '+err);
              res.render("somethingWrong",{error:err})
            }else{
              sess.req=session;
              sess.user_data={user:user[0],role_Data:role[0]};
              res.redirect('/home/');
            }
          })
        }
        else{
          console.log('getting till here');
          sess=req.session;
          sess.user_data={user:user[0],role_Data:{}};
          res.redirect('/home/');
        }
      }
    })
  }
  else{
    console.log('Only for social login');
  }
})
/*#######################################
  ############Student Login##############
  ####################################### */
app.get('/student-Login',(req,res)=>{
  internetConnected().then(()=>{
    res.render('studentSignin');
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*#######################################
  #######Handling Student Login##########
  ####################################### */
app.post('/student-Credentials',function(req,res){
  console.log(req.body);
  Student.find({email:req.body.email,password:req.body.pass},(err,resp)=>{
    console.log(resp[0]);
    if(err||resp[0]==undefined){
      res.redirect('/student-login');
    }else{
      sess.req=session;
      sess.user_data={user:resp[0]};
      if(sess.user_data.user==undefined){
        res.redirect('/student-Login');
      }else{
        res.render('studentdashboard',{student_Data:resp[0]});
      }
    }
  })
})
/*####################################### 
  #########Create Project Superadmin########
  #######################################*/
app.get("/superadmin/create-project",(req,res)=>{
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }
  else{
    res.render("superadminCreateProject1")
  }

 })
 .catch(()=>{
   res.render("noInternet")
 })
}) 
/*####################################### 
  ######### handing Create Project Superadmin########
  #######################################*/
  app.post("/superadmin/create-project",upload.single("projectCover"),(req,res)=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }
    else{
      console.log(req.body)
      var newProject = new superadminProject({
        title:req.body.title,
        summary:req.body.summary,
        subject:req.body.subject,
        grade:req.body.grade,
        keywords:req.body.keywords,
        inquiryQuestion:req.body.inquiryQuestion,
        learningOutcome:req.body.learningOutcome,
        keyContribution:req.body.keyContribution,
        projectCover:req.file.path
      })
      newProject.save().then(result=>{
        console.log("created project")
          req.session.tempId =  result._id
          console.log(req.session.tempId)
          res.redirect("/superadmin/create-activity")
      }).catch(err=>{
        console.log(err)
        res.render("somethingWrong",{error:err})
      })
    }
  })

  /*####################################### 
  #########Create Activity Superadmin########
  #######################################*/
app.get("/superadmin/create-activity",(req,res)=>{
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }
  else{
    res.render("superadminCreateProject2")
  }
 })
 .catch(()=>{
   res.render("noInternet")
 })
})
/*################################# 
  ###Create activity post requests## 
  ################################# */

app.post("/superadmin/create-activity",upload.array("files",4),(req,res)=>{
      console.log(req.session.tempId)
      var files = []
      for(i of req.files){
        files.push(i.path)
      }
      console.log(req.files)
      var obj = {
        activity_title: req.body.description,
        activity_desc:req.body.Details,
        attached_files:files
      }
      superadminProject.findOneAndUpdate({_id:req.session.tempId},{$push:{activity:obj}}).then(result=>{
        console.log(result)
        res.redirect("/superadmin/create-activity")
      })
      .catch(err=>{
        console.log(err)
        res.render("somethingWrong",{error:err})
      })
})
/*####################################### 
  #######Superadmin project preview########
  #######################################*/
  app.get("/superadmin/project-preview",(req,res)=>{
   internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }
    else{
      console.log(req.session.tempId)
      superadminProject.find({_id:req.session.tempId}).then(result=>{
        console.log(result)
        res.render("projectPreviewSuperadmin",{data:result})
      })
    }
   }).catch(()=>{
     res.render("noInternet")
   })
  })

  app.post("/superadmin/publish-project",(req,res)=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }
    else{
      superadminProjects.findOneAndUpdate({_id:req.session.tempId},{
        title:req.body.title,
        summary:req.body.summary,
        learningOutcome:req.body.learningOutcome,
        keyContribution:req.body.keyContribution,
        published:true
      }).then(result=>{
        res.redirect("/superadmin/dashboard")
      })
    }
  })


/*####################################### 
  ##########Superadmin projects#############
  #######################################*/
  app.get("/superadmin/projects",(req,res)=>{
   internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }
    else{
      superadminProject.find({"activity.activity_title":{$exists:true}}).then(result=>{
        console.log(result)
        res.render("superadminProjects",{projects:result})
      })
    } 
   })
   .catch(()=>{
     res.render("noInternet")
   })
  })

  /*####################################### 
  ######Superadmin Draft projects##########
  #######################################*/ 

  app.get("/superadmin/draft-projects",async (req,res)=>{
    internetConnected().then(async ()=>{
      if(sess.user_data==undefined){
        res.redirect('/');
      }
      else{
        var data = await superadminProject.find({activity:[]})
        console.log(data)
        res.render("superadminDrafts",{data:data})
      }
    }).catch(()=>{
      res.render("noInternet")
    })
  })

  
  /*####################################### 
  ##Superadmin Draft projects handling #### 
  #######################################*/ 
app.get("/superadmin/draft-project-preview/:id",(req,res)=>{
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }
    else{
      console.log(req.params)
      superadminProject.find({_id:req.params.id}).then(result=>{
        console.log(result)
        res.render('superadminDraftViewProject',{data:result[0]})
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*####################################### 
  ##Superadmin Draft edit handling #### 
  #######################################*/ 

app.get("/superadmin/edit-projects/:id",(req,res)=>{
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    superadminProject.findById(req.params.id).then(result =>{
      console.log(result)
      req.session.tempId = req.params.id
      res.render("EditDrafts",{data:result})
    })
  
  }
 }).catch(()=>{
   res.render("noInternet")
 })
})

app.post("/superadmin/edit-projects",upload.single("projectCover"),(req,res)=>{
  console.log(req.session.tempId)
  if(sess.user_data==undefined){
    res.redirect('/');
  }
  else{
    superadminProject.findOneAndUpdate({_id:req.session.tempId},{
      title:req.body.title,
      summary:req.body.summary,
      subject:req.body.subject,
      grade:req.body.grade,
      keywords:req.body.keywords,
      inquiryQuestion:req.body.inquiryQuestion,
      learningOutcome:req.body.learningOutcome,
      keyContribution:req.body.keyContribution,
      projectCover:req.file.path
}).then(result=>{
  console.log(result)
  res.redirect("/superadmin/create-activity")
})
  }
})

app.post("/")

/*####################################### 
  ############Home##################
  #######################################*/
app.get('/home/',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('Session data on home:- '+util.inspect(sess.user_data));
      if(sess.user_data.user.Role_object_id==''){
        console.log(sess.user_data.user['email']);
        let first_letter=sess.user_data.user.username.split('');
        res.render('index',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'none'});
        
      }else if(sess.user_data.role_Data.org_name!=''){
        console.log(sess.user_data.role_Data.org_name);
        let first_letter=sess.user_data.user.username.split('');
        if(sess.user_data.user.Role.isEducator==true){
          res.render('index',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator'});
          
        }else if(sess.user_data.user.Role.is10DemProuser==true){
          res.render('index',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator'});
          
        }
        else{
          res.render('index',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org'});
          
        }
      }
    }
  }).catch(()=>{
    res.render("noInternet")
  })
  
      /*else{
        console.log(sess.user_data.role_Data.org_name);
        let first_letter=sess.user_data.user.username.split('');
        res.render('index',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:''});
      }*/
    
    /*else if (sess.user_data.isStudent){
      res.redirect('/dashboard/prouser/student/:id'+sess.user_data._id);
    }
    else if (sess.user_data.isOrg[0]||sess.user_data.isOrg[1]){
      console.log('Session Started: '+sess.user_data);
      let first_letter=sess.user_data.username.split('');
      
      res.render('index',{name:sess.user_data.username,firstletter:first_letter[0]});
      console.log('file rendered');
    } */
})
/*################################
  ######SUPER ADMIN DASHBOARD#####
  ################################ */
app.get('/superadmin/dashboard',async function(req,res){
    internetConnected().then(()=>{
      if(sess.user_data==undefined){
        res.redirect('/');
      }else{
        let count=0;
        let total_count_of_pro_members=0;
        let total_count_of_org_members=0;
        let total_count_of_nporg_members=0;
        let total_count_of_10dem_projects=0;
        let total_count_of_10dem_drafts=0;
        let total_count_of_10dem_ongoing=0;
        let total_count_of_10dem_ext_collb=0;
        let notifications_of_pro_members=[];
        let notifications_of_org_members=[];
        let notifications_of_nporg_members=[];
        let notifications_of_free_users=[];
        user.find({},(err,resp)=>{
          if(err){
            console.log('Some kind of error loading users for superadmindashboard:- '+err);
            res.render("somethingWrong",{error:err})
          }else{
            resp.forEach((user_from_array)=>{
              count++;
              if(user_from_array.Role.isNPOrg==true){
                total_count_of_nporg_members++;
                console.log('Users notification:- '+user_from_array.notifications);
                user_from_array.notifications.forEach((notification)=>{
                  notifications_of_nporg_members.push(notification);
                })
              }else if(user_from_array.Role.isOrg==true){
                total_count_of_org_members++;
                console.log('Users notification:- '+user_from_array.notifications);
                user_from_array.notifications.forEach((notification)=>{
                  notifications_of_org_members.push(notification);
                })
              }else if(user_from_array.Role.is10DemProuser==true){
                total_count_of_pro_members++;
                console.log('Users notification:- '+user_from_array.notifications);
                user_from_array.notifications.forEach((notification)=>{
                  notifications_of_pro_members.push(notification);
                })
              }else{
                console.log('Users notification:- '+user_from_array.notifications);
                user_from_array.notifications.forEach((notification)=>{
                  notifications_of_free_users.push(notification);
                }) 
              }
              console.log('Count of users for superadmin dashboard:- '+resp.length+' and count is :- '+count+' their role is:- '+user_from_array.Role);
              if(count==resp.length){
                let count1=0;
                project.find({},(err,resp1)=>{
                  if(err){
                    console.log('Cannot find projects for superadmin because:- '+err);
                    res.render("somethingWrong",{error:err})
                  }else{
                    resp1.forEach(async (project_from_array)=>{
                      count1++;
                      if(project_from_array.created_by=='5f964cdc52f7629f909c85dc'){
                        total_count_of_10dem_projects++;
                        if(project_from_array.status==true&&project_from_array.collaboration.length==0){
                          total_count_of_10dem_ongoing++;
                        }else if(project_from_array.status==true&&project_from_array.collaboration.length!=0){
                          total_count_of_10dem_ext_collb++;
                        }else if(project_from_array.status==false){
                          total_count_of_10dem_drafts++;
                        }
                      }
                      console.log('Count:- '+count1+' total number of projects:- '+resp1.length);
                      if(count1==resp1.length){
                        console.log('NOPM:- '+notifications_of_pro_members);
                        var Sprojects = await superadminProject.find({"activity.activity_title":{$exists:true}})
                        var drafts= await superadminProject.find({activity:[]})
                        console.log("Draft projects are",drafts)
                        console.log("Superadminprojects are",Sprojects)
                        res.render('superadminDashboard',{tnm:resp.length,tnpm:total_count_of_pro_members,tnom:total_count_of_org_members,tnnm:total_count_of_nporg_members,tnp:resp1.length,tn10p:total_count_of_10dem_projects,tndp:total_count_of_10dem_drafts,tnop:total_count_of_10dem_ongoing,tnep:total_count_of_10dem_ext_collb,noom:notifications_of_org_members,nonpm:notifications_of_nporg_members,nopm:notifications_of_pro_members,nofm:notifications_of_free_users,projects:Sprojects,drafts:drafts});
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
    .catch(()=>{
      res.render("noInternet")
    })
})
/*#####################################
  ##########ORG DETAILS S##############
  ##################################### */
  app.get('/superadmin/dashboard/orgmembership-Users',function(req,res){
    internetConnected().then(()=>{
      if(sess.user_data==undefined){
        res.redirect('/');
      }else{
        let all_org_users=[];
        let count=0;
        PorNPORG.find({},(err,resp)=>{
          if(err){
            console.log('Cannot find users in /superadmin/dashboard/orgmembership-Users because:- '+err);
            res.render("somethingWrong",{error:err})
          }else{
            resp.forEach((users)=>{
              count++;
              all_org_users.push(users);
              console.log('Total users :- '+resp.length+' count:- '+count);
              if(count==resp.length){
                console.log('Data sent in /superadmin/dashboard/orgmembership-Users is:- '+all_org_users);
                res.render('superadminOrgDetails',{orgdetails:all_org_users});
              }
            })
          }
        })
      }
    }).catch(()=>{
      res.render("noInternet")
    })
  })
  /*##############################
    #######FREE USER DETAILS######
    ############################## */
app.get('/superadmin/dashboard/free-Users',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      let all_free_users=[];
      let count=0;
      user.find({},(err,resp)=>{
        resp.forEach((users)=>{
          count++;
          if(users.Role.is10DemProuser==false&&users.Role.isEducator==false&&users.Role.isNPOrg==false&&users.Role.isOrg==false){
            all_free_users.push(users);
          }
          console.log('Count going on:- '+count+' total users:- '+resp.length);
          if(count==resp.length){
            res.render('superadminFreeDetails',{freedetails:all_free_users});
          }
        })
      })
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
/*################################
  #######Non Profits Details######
  ################################ */
  app.get('/superadmin/dashboard/nonprofit-Users',function(req,res){
    internetConnected().then(()=>{
      if(sess.user_data==undefined){
        res.redirect('/');
      }else{
        let nporgdetails=[];
        let count=0;
        PorNPORG.find({},(err,resp)=>{
          resp.forEach((users)=>{
            count++;
            if(users.verification_status==true){
              nporgdetails.push(users);
            }
            console.log('Count:- '+count+' nporg length:- '+ resp.length);
            if(count==resp.length){
              res.render('superadminNPOrgDetails',{nporgs:nporgdetails});
            }
          })
        })
      }
    })
    .catch(()=>{
      res.render("noInternet")
    })
  })
  /*################################
  ######10Dem Pro Members Details#
  ################################ */
app.get('/superadmin/dashboard/10dempro-Users',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      let all_pro_users=[];
      let count=0;
      user.find({},function(err,resp){
        resp.forEach((users)=>{
          count++;
          if(users.Role.is10DemProuser){
            all_pro_users.push(users);
          }
          console.log('Count:- '+count+' users length:- '+ resp.length);
          if(count==resp.length){
            res.render('superadminProDetails',{prodetails:all_pro_users});
          }
        })
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/* ###############################
   #######EDUCATOR DASHBOARD######
   ###############################*/
app.get('/educatordashboard',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      let first_letter=sess.user_data.user.username.split('');
      if(sess.user_data.user.Role.isEducator==true){
        if(sess.user_data.role_Data.classes.length==0){
          res.render('educatorDashboard',{classesare:[],firstletter:first_letter[0],name:sess.user_data.user.username,role:'educator',orgname:sess.user_data.role_Data.org_name,notifications:sess.user_data.user.notifications});
        }else{
          let classes_are=[];
          let count=0;
          sess.user_data.role_Data.classes.forEach(function(document){
            classes.findById(document,function(err,single_class){
              classes_are.push(single_class);
              count++;
              console.log('Count:- '+count+' Classes length:- '+sess.user_data.role_Data.classes.length)
              if(count==sess.user_data.role_Data.classes.length){
                res.render('educatorDashboard',{classesare:classes_are,firstletter:first_letter[0],name:sess.user_data.user.username,role:'educator',orgname:sess.user_data.role_Data.org_name,notifications:sess.user_data.user.notifications});
              }
            })
          })
        }
      }else{
        classes_are=[];
        if(sess.user_data.role_Data.classes.length==0){
          res.render('educatorDashboard',{classesare:[],firstletter:first_letter[0],name:sess.user_data.user.username,role:'educator',orgname:'',notifications:sess.user_data.user.notifications});
        }else{
          sess.user_data.role_Data.classes.forEach(element => {
            console.log(element);
            classes.findById(element,function(err,single_class){
              if(err){
                console.log('Cant get any classes'+err);
                res.render("somethingWrong",{error:err})
              }else{
                classes_are.push(single_class);
                console.log(single_class);
                console.log(classes_are);
                console.log(classes_are.length==sess.user_data.role_Data.classes.length);
                if(classes_are.length==sess.user_data.role_Data.classes.length){
                  console.log('Classes are:- '+classes_are);
                  res.render('educatorDashboard',{classesare:classes_are,firstletter:first_letter[0],name:sess.user_data.user.username,role:'educator',orgname:'',notifications:sess.user_data.user.notifications});
                }
              }
            })
          });
        }
      }
  } 
  }).catch(()=>{
    res.render("noInternet")
  })
});
/*##################################
  #######ADD CLASS################## 
  ################################## */
app.get('/addClass',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log(util.inspect(req.query));
      let obj={
        created_by_id:sess.user_data.user._id,
        grade:req.query.class,
        section:req.query.grade,
        color:req.query.color,
        classname:req.query.classname
      }
      classes.create(obj,(err,resp)=>{
        if(err){
          console.log('error creating classes for org admin because :- '+err);
          res.render("somethingWrong",{error:err});
        }else{
          console.log('class created:- '+resp);
          sess.user_data.role_Data.classes.push(resp._id);
          let obj={
            classes:sess.user_data.role_Data.classes,
          }
          console.log(obj);
          PorNPORG.findOneAndUpdate({_id:sess.user_data.role_Data._id},{$set:obj},{new:true},(err,resp)=>{
            if(err){
              console.log('Error finding this class');
              res.render("somethingWrong",{error:err});
            }else{
              sess.user_data.role_Data=resp;
              console.log(sess.user_data.role_Data);
              res.redirect('/classDetails');
            }
          })
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet");
  })
})
/*##################################
  ##########EXPORT CLASSES##########
  ################################## */
  app.get('/exportclass/:id',function(req,res){
   internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      classes_now=sess.user_data.role_Data.classes;
      classes_now.push(req.params.id);
      let obj={
        classes:classes_now,
      }
      educatoror10dempro.findOneAndUpdate({_id:sess.user_data.user.Role_object_id},{$set:obj},{new:true},function(err,resp){
        if(err){
          console.log(err);
          res.render("somethingWrong",{error:err})
        }else{
          sess.user_data.role_Data=resp;
          console.log('################################################\n            Current session data              \n #############################################\n '+util.inspect(sess.user_data));
          if(sess.user_data.user.Role.isEducator==true){
            res.redirect('/educatordashboard');
          }else{
            res.redirect('/orgDetails');
          }  
        }
      })
    }
   })
   .catch(()=>{
     res.render("noInternet")
   })
  })
/*##################################
  #########Adding Students##########
  ################################## */
app.get('/managestudents/:class',(req,res)=>{
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log(req.params.class);
      classes.find({_id:req.params.class},(err,resp)=>{
        if(err){
          console.log('Cannot find that class in /managestudent/ because:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log(resp[0]);
          if(resp[0].students.length==0){
            res.render('manageClass',{name:sess.user_data.user.username,class_Data:resp[0],students_Data:[],role:'educator',hide_manage_students:false,org_name:sess.user_data.role_Data.org_name});
          }else{
            let students=[];
            let count=0;
            resp[0].students.forEach((studentid)=>{
              count++;
              Student.find({_id:studentid},(err,resp1)=>{
                if(err){
                  console.log('cannot find students of this class in managestudents/:class:- '+err);
                  res.render("somethingWrong",{error:err})
                }else{
                  students.push(resp1[0]);
                  if(count==resp[0].students.length){
                    res.render('manageClass',{name:sess.user_data.user.username,class_Data:resp[0],students_Data:students,role:'educator',hide_manage_students:false,org_name:sess.user_data.role_Data.org_name});
                  }
                }
              })
            })
  
          }
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*##################################
  ####Editing Students details######
  ################################## */
app.get('/editingStudent/:class/:id',function(req,res){
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(req.params.class+req.params.id);
    let classes_Data=[];
    let count=0;
    Student.find({_id:req.params.id},(err,resp)=>{
      if(err){
        console.log(err);
      }else{
        sess.user_data.role_Data.classes.forEach((classesare)=>{
          classes.find({_id:classesare},(err,resp1)=>{
            classes_Data.push(resp1[0]);
            console.log(resp1[0]);
            count++;
            console.log('count:-'+count+' classes:- '+sess.user_data.role_Data.classes.length);
            if(count==sess.user_data.role_Data.classes.length){
              console.log('#############################\n ####GOING CLASSES###############\n ###############################\n'+classes_Data);
              res.render('editStudent',{name:sess.user_data.user.username,role:'educator',org_name:sess.user_data.role_Data.org_name,hide_manage_students:false,students_Data:resp[0],classes_available:classes_Data});
            }
          })
        })
      }
    })
  }
 }).catch(()=>{
   res.render("noInternet")
 })
})
/*##################################
  #Handling Editing Student PostReq#
  ################################## */
app.post('/editingStudent/:student_id',(req,res)=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(req.params.student_id,util.inspect(req.body));
    Student.find({_id:req.params.student_id},(err,resp)=>{
      classes.find({_id:resp[0].class_id},(err1,resp1)=>{
        let index = resp1[0].students.indexOf(req.params.student_id);
        resp1[0].students.splice(index,1);
        let obj={
          students:resp1[0].students,
        }
        classes.findOneAndUpdate({_id:resp[0].class_id},{$set:obj},{new:true},(err2,resp2)=>{
          classes.find({_id:req.body.class_assigned},(err3,resp3)=>{
            console.log('getting in resp3');
            let newarrival=[resp[0]._id,];
            let obj={
              students:resp3[0].students.concat(newarrival)
            }
            classes.findOneAndUpdate({_id:req.body.class_assigned},{$set:obj},{new:true},(err4,resp4)=>{
              console.log('getting in resp4');
              let obj={
                name:req.body.firstname+' '+req.body.lastname,
                password:req.body.password,
                class_id:req.body.class_assigned,
                grade:resp4.grade,
                section:resp4.section,
              }
              Student.findOneAndUpdate({_id:req.params.student_id},{$set:obj},{new:true},(err5,resp5)=>{
                console.log('getting in resp5');
                if(err5){
                  console.log(err5);
                }else{
                  res.redirect('/educatordashboard');
                }
              })
            })
          })
        })
      })
    })
  }
})
/*##################################
  #Handling Post Req of Add student#
  ################################## */
app.post('/addingstudent/:grade/:section/:id',(req,res)=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(util.inspect(req.body)+util.inspect(req.params));
    let obj={
      name:req.body.firstname+' '+req.body.lastname,
      email:req.body.email,
      password:req.body.firstname+Math.random(),
      grade:req.params.grade,
      section:req.params.section
    }
    console.log('obj is:- '+util.inspect(obj));
    Student.create(obj,function(err,resp){
      if(err){
        console.log('Cannot upload due to this error in /addingstudent/:grade/:section :- '+err);
        res.render("somethingWrong",{error:err})
      }else{
        var mailOptions = {
          from: '10demdeveloper@gmail.com',
          to: req.body.email,
          subject: 'Your Student credentials',
          text: `Your credentials:- \nYour email:- ${resp.email}\nYour password:- ${resp.password}.\n\n\n Please login through this link:- localhost:3000/student-Login`
        };
        mail.sendMail(mailOptions,(err,info)=>{
          if(err){
            console.log(err);
            res.render("somethingWrong",{error:err})
          }
          else{
            console.log(info.response);
          }
        })
        classes.find({_id:req.params.id},(err,resp1)=>{
          let current_students=resp1[0].students;
          current_students.push(resp._id);
          let obj={
            students:current_students,
          }
          classes.findOneAndUpdate({_id:req.params.id},{$set:obj},(err,resp)=>{
            if(err){
              console.log('Cannot upload new class data because:- '+err);
              res.render("somethingWrong",{error:err})
            }else{
              res.redirect('/managestudents/'+req.params.id);
            }
          })
        })
      }
    })
  }
})
/*##################################
  #Handling csv upload manage class#
  ################################## */
app.post('/addingstudent/csv/:class',upload.single('csvfile'),(req,res)=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(req.file.path);
    xlsxreader({
      input:req.file.path,
      output:null,
      lowerCaseHeaders:true
    },(error,response)=>{
      if(error)
      {
        console.log('Cannot read csv because:- '+error)
        res.render("somethingWrong",{error:error});
      }
      else{
        console.log(req.params.class);
        classes.find({_id:req.params.class},(err,resp)=>{
          if(err){
            console.log('Cannot find class while reading csv file:- '+err);
            res.render("somethingWrong",{error:err})
          }else{
            let current_students=resp[0].students;
            let count=0;
            response.forEach((details)=>{
              count++;
              let obj={
                name:details.name,
                email:details.email,
                password:details.name+Math.random(),
                grade:resp[0].grade,
                section:resp[0].section
              }
              console.log(obj);
              Student.create(obj,function(err1,resp1){
                if(err1){
                  console.log('Cannot create student while reading from csv:- '+err1);
                  res.render("somethingWrong",{error:err1})
                }else{
                  var mailOptions = {
                    from: '10demdeveloper@gmail.com',
                    to: resp1.email,
                    subject: 'Your Student credentials',
                    text: `Your credentials:- \nYour email:- ${resp1.email}\nYour password:- ${resp1.password}.\n\n\n Please login through this link:- localhost:3000/student-Login`
                  };
                  mail.sendMail(mailOptions,(err,info)=>{
                    if(err){
                      console.log(err);
                      res.render("somethingWrong",{error:err})
                    }
                    else{
                      console.log(info.response);
                    }
                  })
                  current_students.push(resp1._id);
                  console.log(count+' '+response.length)
                  if(count==response.length){
                    let classupdobj={
                      students:current_students,
                    }
                    classes.findOneAndUpdate({_id:req.params.class},{$set:classupdobj},(err,resp)=>{
                      if(err){
                        console.log('Cannot update class after creating student while reading csv:- '+err);
                        res.render("somethingWrong",{error:err})
                      }else{
                        fs.remove(req.file.path,(err)=>{
                          if(err) 
                          {console.log('Couldnt delete the file because:- '+err)
                          res.render("somethingWrong",{error:err});}
                          else{ console.log('Deleted!');}
                        })
                        res.redirect('/managestudents/'+req.params.class);
                      }
                    })
                  }
                }
              })
            })
          }
        })
      }
    })
  }
})
/*##################################
  ######Organisation Details########  
  ################################## */
app.get('/orgDetails',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      PorNPORG.find({org_name:sess.user_data.role_Data.org_name},function(err,resp){
        if(err){
          console.log('Error in org details finding PorNPOrg:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          let first_letter=sess.user_data.user.username.split('');
          classes_are=[];
          console.log('PorNPOrg of the org:- '+resp[0]);
          console.log('Number of educators'+resp[0].Educators.length);
          if(resp[0].classes.length==0){
           if(resp[0].Educators.length==0){
              res.render('organizationClass',{classesare:[],educators:resp[0].Educators,firstletter:first_letter[0],name:sess.user_data.user.username,role:sess.user_data.user.Role,orgname:resp[0].org_name,notifications:sess.user_data.user.notifications});
            }else{
              res.render('organizationClass',{classesare:[],educators:resp[0].Educators,firstletter:first_letter[0],name:sess.user_data.user.username,role:sess.user_data.user.Role,orgname:resp[0].org_name,notifications:sess.user_data.user.notifications});
            }
          }else{
            let classes_are=[];
            let count=0;
            resp[0].classes.forEach(function(document){
             classes.find({_id:document},function(err,resp1){
                if(err){
                  console.log('Cannot find other users');
                  res.render("somethingWrong",{error:err})
                }else{
                  classes_are.push(resp1[0]);
                  count++;
                  console.log('count:- '+count+' total classes:- '+resp[0].classes.length);
                  console.log('Number of Educators:- '+resp[0].Educators.length);
                  if(count==resp[0].classes.length){
                    res.render('organizationClass',{name:sess.user_data.user.username,firstletter:first_letter[0],classesare:classes_are,orgname:resp[0].org_name,role:sess.user_data.user.Role,educators:resp[0].Educators.length,notifications:sess.user_data.user.notifications});
                  }
                }
              })
            })
          }
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*##################################
  ######Org Details Educators#######
  ################################## */
app.get('/orgDetails/educators',async function(req,res){
  internetConnected().then(async ()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      var req_data =[]
      console.log("Started")
      var resp = await PorNPORG.find({org_name:sess.user_data.role_Data.org_name})
      for(i of resp[0].Educators){
        var found_data = await user.find({_id:i})
        req_data.push(found_data)
      }
      console.log("Required educator data is", req_data)
      res.render("organizationEducator",{role:sess.user_data.user.Role,org_name:resp[0].org_name,name:sess.user_data.user.username,data:resp[0],educators:req_data})
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
/*##################################
  #####Organisation Dashboard#######
  ##################################*/
app.get('/orgdashboard',function(req,res){
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    if(sess.user_data.role_Data.classes.length==0 && sess.user_data.role_Data.classes.length==0){
      res.render('adminDashboard2',{name:sess.user_data.user.username,
                                    orgname:sess.user_data.role_Data.org_name,
                                    totalnoofclasses:sess.user_data.role_Data.classes.length,
                                    totalnoofeducators:-sess.user_data.role_Data.Educators.length,
                                    totalnoofstudents:sess.user_data.role_Data.classes.length,
                                    totalnoofExtprojects:-sess.user_data.role_Data.Educators.length,
                                    totalnoofprojects:sess.user_data.role_Data.Educators.length});
    }else{
      let classes1=[];
      let count=0;
      let totalextproj=0;
      let totalproj=0;
      sess.user_data.role_Data.classes.forEach(function(document){
        console.log('Document incoming from foreach in line 490:- '+String(document));
        classes.find({_id:String(document)},function(err,resp){
          if(err){
            console.log('inside /orgdashboard else loop cant find educators:- '+err);
            res.render("somethingWrong",{error:err})
          }else{
            console.log('getting in here:- '+resp[0])
            classes1.push(resp[0]);
            totalextproj+=resp[0].projects.length;
            totalproj+=resp[0].projects.length;
            count++;
            console.log(count+' '+sess.user_data.role_Data.classes.length);
            if(count==sess.user_data.role_Data.classes.length){
              console.log('getting in the admindashboard2 render if');
              res.render('admindashboard2',{name:sess.user_data.user.username,
                                            orgname:sess.user_data.role_Data.org_name,
                                            totalnoofclasses:sess.user_data.role_Data.classes.length,
                                            totalnoofeducators:sess.user_data.role_Data.Educators.length,
                                            totalnoofstudents:0,
                                            totalnoofExtprojects:totalextproj,
                                            totalnoofprojects:totalproj});
            }
          }
        })
      })
    }
  }
 }).catch(()=>{
   res.render("noInternet")
 })
})

/*################################
  #####Educators + DETAILS #######
  ################################ */
app.get("/all-classes",(req,res)=>{
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('getting in here:-'+sess.user_data.role_Data.classes.length);
      if(sess.user_data.role_Data.classes.length==0){
        res.render('allClasses',{name:sess.user_data.user.username,
                              orgname:sess.user_data.role_Data.org_name,
                              classes:[],
                              grade:[]});
      }
      else{
        let count=0;
        let classesare=[];
        sess.user_data.role_Data.classes.forEach(function(document){
          classes.find({_id:document},function(err,resp){
            if(err){
              console.log('error in else loop /classDetails cannot find classes:- '+err);
              res.render("somethingWrong",{error:err})
            }else{
              classesare.push(resp[0]);
              count++;
              if(count==sess.user_data.role_Data.classes.length){
                console.log(classesare);
                res.render('allClasses',{name:sess.user_data.user.username,
                                      orgname:sess.user_data.role_Data.org_name,
                                      classes:classesare,
                                      grade:[]});
              }
            }
          })
        })
      }
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})

/*################################
  #####Educators + DETAILS #######
  ################################ */
app.get('/orgdashboard/educators',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      if(sess.user_data.role_Data.Educators.length==0){
        res.render('manageEducator',{name:sess.user_data.user.username,
                                    orgname:sess.user_data.role_Data.org_name,
                                    alleducators:[]})
      }else{
        let educators_are=[];
        let count=0;
        sess.user_data.role_Data.Educators.forEach(function(Educator){
          user.find({_id:Educator},function(err,user){
            if(err){
              console.log('Cannot find user in line 527 because:- '+err);
              res.redirect('/orgdashboard');
            }else{
              educators_are.push(user[0]);
              count++;
              console.log('Count:- '+count+' Educators:- '+sess.user_data.role_Data.Educators.length);
              if(count==sess.user_data.role_Data.Educators.length){
                console.log('##################################\n ####All the educators going#### \n  ##################################'+educators_are);
                res.render('manageEducator',{name:sess.user_data.user.username,
                                            orgname:sess.user_data.role_Data.org_name,
                                            alleducators:educators_are});
              }            
            }
          })
        })
      }
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*################################
  ######ALL EDUCATORS ADMIN#######
  ################################ */
app.get('/all-Educators',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      if(sess.user_data.role_Data.Educators.length==0){
        res.render('allEducators',{name:sess.user_data.user.username,
                                    orgname:sess.user_data.role_Data.org_name,
                                    alleducators:[]})
      }else{
        let educators_are=[];
        let count=0;
        sess.user_data.role_Data.Educators.forEach(function(Educator){
          user.find({_id:Educator},function(err,user){
            if(err){
              console.log('Cannot find user in line 527 because:- '+err);
              res.redirect('/orgdashboard');
            }else{
              educators_are.push(user[0]);
              count++;
              console.log('Count:- '+count+' Educators:- '+sess.user_data.role_Data.Educators.length);
              if(count==sess.user_data.role_Data.Educators.length){
                console.log('##################################\n ####All the educators going#### \n  ##################################'+educators_are);
                res.render('allEducators',{name:sess.user_data.user.username,
                                            orgname:sess.user_data.role_Data.org_name,
                                            alleducators:educators_are});
              }            
            }
          })
        })
      }
    }
  }).catch(()=>{res.render("noInternet")})
})
/*################################
  #####ORG PROFILE SETTINGS#######
  ################################ */
app.get('/orgprofile/profile',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('######################################\n INSIDE /orgprofile/profile \n ###############################################\n');
      console.log(sess.user_data);
      let first_letter=sess.user_data.user.username.split('');
      res.render('adminProfile1',{id:sess.user_data.user._id,name:sess.user_data.user.username,orgname:sess.user_data.role_Data.org_name,phonenumber:sess.user_data.role_Data.phone_Number,email:sess.user_data.user.email})
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*#################################
  ##HANDLING ORG PROFILE UPDATES###
  #################################*/
app.post('/updateorgprofile/:id',function(req,res){
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log('In post request /updateorgprofile/:id:- '+req.body);
    if(req.body.Firstname+' '+req.body.Lastname!=req.body.name){
      res.redirect('/orgprofile/profile');
    }else{
      let obj={
        username:req.body.name,
        email:req.body.email,
      }
      user.findOneAndUpdate({_id:req.params.id},{$set:obj},{new:true},function(err,resp){
        sess.user_data.user=resp;
        console.log(sess.user_data.user);
        let obj1={
          phone_Number:req.body.phone_Number,
        };
        console.log(resp.Role_object_id);
        PorNPORG.findOneAndUpdate({_id:resp.Role_object_id},{$set:obj1},{new:true},function(err,resp){
          sess.user_data.role_Data=resp;
          console.log('Org :='+resp);
          res.redirect('/orgprofile/profile');
        })
      })
    }
  }
})

/*################################# 
  ##FORGOT PASSWORD##
  ################################# */
var generateOTP = ()=>{
  var digits = '0123456789';
  let OTP = ''; 
  for (let i = 0; i < 4; i++ ) { 
      OTP += digits[Math.floor(Math.random() * 10)]; 
  } 
  return OTP; 

}
app.get("/forgot-password",(req,res)=>{
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else
  {res.render("SignIn-otp")}
 }).catch(()=>{
   res.render("noInternet")
 })
})

app.post("/send-OTP",(req,res)=>{
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else
{ user.find({email:req.body.email}).then(data=>{
   if(data.length==1){
     var OTP = generateOTP()
     console.log(OTP)
    var mailOptions = {
      from: '10demdeveloper@gmail.com',
      to: req.body.email,
      subject: '10dem forgot-password OTP',
      text: `Your OTP is ${OTP}`
    };
    mail.sendMail(mailOptions,(err,success)=>{
      if(err){
        console.log(err)
        res.render("somethingWrong",{error:err})
      }
      else{
        console.log(success)
        req.session.temp = req.body.email
        res.render("signin-reset",{otp:OTP})
      }
    })
   }
 })}
 })
 .catch(()=>{
   res.render("noInternet")
 })
})

app.post("/password-change",(req,res)=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else
  {console.log(req.body)
  console.log(req.session.temp)
  user.findOneAndUpdate({email:req.session.temp},{password:req.body.password}).then(result=>{
    console.log("Password Successfully Updated")
    res.redirect("/")
  }).catch(err=>{
    console.log(err)
    res.render("somethingWrong",{error:err})
  })}
})

/*#################################
  #####ORG PROFILE SETTINGS 2######
  ################################# */
app.get('/orgprofile/profile2',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      res.render('adminProfile2',{id:sess.user_data.role_Data._id,name:sess.user_data.user.username,email:sess.user_data.user.email,img:sess.user_data.role_Data.img,orgname:sess.user_data.role_Data.org_name,phonenumber:sess.user_data.role_Data.phone_Number});
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
  /*################################
    #HANDLING ORG PROFILE SETTINGS2#
    ################################ */
app.post('/updateorgprofile2/:id',upload.single('image'),(req,res)=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log('Req.body:- '+util.inspect(req.body));
    console.log('\n req.file:- '+req.file);
    PorNPORG.findOneAndUpdate({_id:sess.user_data.role_Data._id},{$set:req.body},{new:true},(err,resp)=>{
      sess.user_data.role_Data=resp;
      res.redirect('/orgprofile/profile2');
    })
  }
})

/*#################################
  #####ORG PROFILE SETTINGS 3######
  ################################# */
app.get("/orgprofile/change-password",(req,res)=>{
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      res.render('adminProfile3',{id:sess.user_data.role_Data._id,name:sess.user_data.user.username,email:sess.user_data.user.email,img:sess.user_data.role_Data.img,orgname:sess.user_data.role_Data.org_name,phonenumber:sess.user_data.role_Data.phone_Number});
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})

app.post("/change-password/:id",async (req,res)=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(req.body)
    console.log(sess.user_data.password)
    if(req.body.Current === sess.user_data.user.password &&  req.body.newPassword == req.body.Confirm){
      user.findOneAndUpdate({_id:sess.user_data.user._id},{password:req.body.Confirm}).then(result=>{
        console.log(result)
        console.log("Updated")
        res.redirect("/home/")
      })
    }
    else if(req.body.newPassword !== req.body.Confirm){
      console.log("password don't match")
      res.redirect("/orgprofile/change-password")
    }
    else if(req.body.Current !== sess.user_data.user.password){
      console.log("Current password is wrong")
      res.redirect("/orgprofile/change-password")
    }
    else if(req.body.Current==req.body.Confirm){
      console.log("Cant use old password")
      res.redirect("/orgprofile/change-password")

    }
    
}

})

/*#################################
  ##########Class details##########
  ################################# */
app.get('/classDetails',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('getting in here:-'+sess.user_data.role_Data.classes.length);
      if(sess.user_data.role_Data.classes.length==0){
        res.render('addClass',{name:sess.user_data.user.username,
                              orgname:sess.user_data.role_Data.org_name,
                              classes:[],
                              grade:[]});
      }
      else{
        let count=0;
        let classesare=[];
        sess.user_data.role_Data.classes.forEach(function(document){
          classes.find({_id:document},function(err,resp){
            if(err){
              console.log('error in else loop /classDetails cannot find classes:- '+err);
              res.render("somethingWrong",{error:err})
            }else{
              classesare.push(resp[0]);
              count++;
              if(count==sess.user_data.role_Data.classes.length){
                console.log(classesare);
                res.render('addClass',{name:sess.user_data.user.username,
                                      orgname:sess.user_data.role_Data.org_name,
                                      classes:classesare,
                                      grade:[]});
              }
            }
          })
        })
      }
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
/*#################################
  #########Create Educators########
  ################################# */
app.post('/createEducator/:orgname',function(req,res){
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(util.inspect(req.body)+'\n ############################################# \n'+util.inspect(req.params)+'\n ########################################\n');
    let obj={
      verification_status:false,
      org_name:req.params.orgname,
    }
    educatoror10dempro.create(obj,function(err,created_educator){
      if(err){
        console.log('cannot create the educator at line 664:- '+err);
        res.redirect('/orgdashboard');
      }else{
        let obj1={
          username:req.body.First_Name+req.body.Last_Name,
          email:req.body.Email_id,
          social_email:req.body.Email_id,
          password:req.body.First_Name+req.body.Last_Name,
          Role:{
            isEducator:true,
          },
          Role_object_id:created_educator._id,
        }
        user.create(obj1,function(err,created_user_of_educator){
          if(err){
            console.log('Cannot create user for this specific educator in line 679:- '+created_user_of_educator);
            res.redirect('/orgdashboard');
          }else{
            var mailOptions = {
              from: '10demdeveloper@gmail.com',
              to: created_user_of_educator.email,
              subject: 'You have been registered as an Educator at 10Dem by:- '+req.params.orgname,
              text: 'Here is your email:- '+req.body.Email_id+' and your password is:- '+req.body.First_Name+req.body.Last_Name
            };
            
            mail.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                res.render("somethingWrong",{error:error})
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            let Educators_now=sess.user_data.role_Data.Educators;
            Educators_now.push(created_user_of_educator._id);
            let obj2={
              Educators:Educators_now,
            }
            PorNPORG.findOneAndUpdate({_id:sess.user_data.role_Data._id},{$set:obj2},{new:true},function(err,resp){
              sess.user_data.role_Data=resp;
              res.redirect('/orgdashboard');
            })
          }
        })
      }
    })
  }
})
/*##################################
  #EXTERNALLY COLLAB PROJECTS ADMIN#
  ################################## */
app.get('/adminexternalcollabs',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      let first_letter=sess.user_data.user.username.split('');
      if(sess.user_data.role_Data.Educators.length==0){
        res.render('adminEC',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:[]});
      }else{
        console.log('Getting in /adminexternalcollab else else condition.Number of Educators are :- '+sess.user_data.role_Data.Educators.length);
        let ext_collb_proj=[];
        let count=0;
        sess.user_data.role_Data.Educators.forEach(function(document){
          user.find({_id:document},function(err,educator){
            //console.log('###########################################\n ###########educator incoming:-##############\n ##################################### '+ educator[0]);
            if(educator[0].Projects.length==0){
              count++;
              console.log('###########################################\n ##############No projects for this educator:-############\n ###########################################\n '+count);
            }else{
              count++;
              let count1=0;
              console.log('Count:- '+count+' number of educators:- '+ sess.user_data.role_Data.Educators.length+' number of projects of this educator:- '+educator[0].Projects.length);
              educator[0].Projects.forEach(function(document1){
                project.findById(document1,function(err,resp){
                  count1++;
                  if(err){
                    console.log('Error while getting projects in /adminexternalcollabs in else else else:- '+err);
                    res.render("somethingWrong",{error:err})
                  }else{
                    console.log('###############################################\n###########INCOMING PROJECTS##################\n###############################################\n'+resp.collaboration.length!=0);
                    if(resp.collaboration.length!=0){
                      ext_collb_proj.push(resp);
                    }
                    console.log('Count at if condition:- '+count+' Number of Educators:- '+sess.user_data.role_Data.Educators.length+' count1 at if condition:- '+count1+' projects length of this educator:- '+educator[0].Projects.length);
                    if(count==sess.user_data.role_Data.Educators.length&&count1==educator[0].Projects.length){
                        console.log('##################################\n#################INCOMING PROJECTS#######################\n######################################\n'+ext_collb_proj);
                        res.render('adminEC',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:ext_collb_proj});
                    }                  
                  }
                })
              })
            }
          })
        })
      }
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*################################# 
  ###########MY PROJECTS###########
  ################################# */
app.get('/myprojects',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('##########################################\nONGOING PROJECTS\n#########################################');
      let wholedata=[];
      let count=0;
      let first_letter=sess.user_data.user.username.split('');
      if(sess.user_data.user.Projects.length==0){
        if(sess.user_data.user.Role.is10DemProuser){
          res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',projects:[]});
        }else if(sess.user_data.user.Role.isEducator){
          res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',projects:[]});
        }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
          res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:[]});
        }else{
          res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',projects:[]});
        }
      }
      else{
        sess.user_data.user.Projects.forEach(function(document_id){
          project.find({_id:document_id},function(err,resp){
            if(resp[0].status){
              if(resp[0].start_date.valueOf()<resp[0].end_date.valueOf()){
                wholedata.push(resp[0]);
              }
            }
            count+=1;
            console.log('count:- '+count+' length:- '+sess.user_data.user.Projects.length);
            if(count==sess.user_data.user.Projects.length){
              console.log('All projects being sent to myprojects:- '+wholedata);
              if(sess.user_data.user.Role.is10DemProuser){
                res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',projects:wholedata});
              }else if(sess.user_data.user.Role.isEducator){
                res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',projects:wholedata});
              }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
                res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:wholedata});
              }else{
                res.render('myprojects',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',projects:wholedata});
              }
            }
          })
        })
      }
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
/*################################
  ########External Collab#########
  ################################ */
app.get('/externalcollab',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('##########################################\nEXTERNAL COLLABORATION\n#########################################');
      let wholedata=[];
      let count=0;
      let first_letter=sess.user_data.user.username.split('');
      sess.user_data.user.Projects.forEach(function(document_id){
        project.find({_id:document_id},function(err,resp){
          if(resp[0].collaboration[0]!=undefined){
            wholedata.push(resp[0]);
          }
          count+=1;
          if(count==sess.user_data.user.Projects.length){
            console.log('All projects being sent to myprojects:- '+wholedata);
            if(sess.user_data.user.Role.is10DemProuser){
              res.render('externalcollaboration',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',ext_collb_proj:wholedata});
            }else if(sess.user_data.user.Role.isEducator){
              res.render('externalcollaboration',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',ext_collb_proj:wholedata});
            }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
              res.render('externalcollaboration',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',ext_collb_proj:wholedata});
            }else{
              res.render('externalcollaboration',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',ext_collb_proj:wholedata});
            }
          }
        })
      })
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
  /*################################
    ############DRAFTS##############
    ################################ */
  app.get('/drafts',function(req,res){
    internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('##########################################\nDRAFTS\n#########################################');
      let wholedata=[];
      let count =0;
      let first_letter=sess.user_data.user.username.split('');
      sess.user_data.user.Projects.forEach(function(document_id){
        project.find({_id:document_id},function(err,resp){
          if(!resp[0].status){
            wholedata.push(resp[0]);
          }
          count+=1;
          if(count==sess.user_data.user.Projects.length){
            console.log('All projects being sent to myprojects:- '+wholedata);
            if(sess.user_data.user.Role.is10DemProuser){
              res.render('drafts',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',projects:wholedata});
            }else if(sess.user_data.user.Role.isEducator){
              res.render('drafts',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',projects:wholedata});
            }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
              res.render('drafts',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:wholedata});
            }else{
              res.render('drafts',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',projects:wholedata});
            }
          }
        })
      })
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})
/*#################################
  ############COMPLETED############ 
  #################################*/
app.get('/completed',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('##########################################\nCOMPLETED PROJECTS\n#########################################');
      let wholedata=[];
      let count=0;
      let first_letter=sess.user_data.user.username.split('');
      sess.user_data.user.Projects.forEach(function(document_id){
        project.find({_id:document_id},function(err,resp){
          if(resp[0].status){
            if(resp[0].start_date.valueOf()>resp[0].end_date.valueOf()){
              wholedata.push(resp[0]);
            }
          }
          count+=1;
          console.log('count:- '+count+' length:- '+sess.user_data.user.Projects.length);
          if(count==sess.user_data.user.Projects.length){
            console.log('All projects being sent to myprojects:- '+wholedata);
            if(sess.user_data.user.Role.is10DemProuser){
              res.render('completed',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',projects:wholedata});
            }else if(sess.user_data.user.Role.isEducator){
              res.render('completed',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',projects:wholedata});
            }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
              res.render('completed',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:wholedata});
            }else{
              res.render('completed',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',projects:wholedata});
            }
          }
        })
      })
    }
  })
  .catch(()=>{
    res.render("noInternet")
  })
})

/*################################# 
  ###Create Project in Dashboard### 
  #################################*/
app.get('/home/createproject/:id',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
        console.log('Session data on home:- '+util.inspect(sess.user_data));
        if(req.params.id==1){
          if(sess.user_data.user.Role_object_id==''){
            console.log(sess.user_data.user['email']);
            let first_letter=sess.user_data.user.username.split('');
            res.render('createproject1n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'none'});
          }else if(sess.user_data.role_Data.org_name!=''){
            console.log(sess.user_data.role_Data.org_name);
            let first_letter=sess.user_data.user.username.split('');
            if(sess.user_data.user.Role.is10DemProuser==true||sess.user_data.user.Role.isEducator==true){
              res.render('createproject1n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator'});
            }
            else{
              res.render('createproject1n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org'});
            }
          }
        }
        else if(req.params.id==2){
          if(sess.user_data.user.Role_object_id==''){
            console.log(sess.user_data.user['email']);
            let first_letter=sess.user_data.user.username.split('');
            res.render('createproject2n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'none'});
          }else if(sess.user_data.role_Data.org_name!=''){
            console.log(sess.user_data.role_Data.org_name);
            let first_letter=sess.user_data.user.username.split('');
            if(sess.user_data.user.Role.is10DemProuser==true||sess.user_data.user.Role.isEducator==true){
              res.render('createproject2n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator'});
            }
            else{
              res.render('createproject2n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org'});
            }
          }
        }else{
          if(sess.user_data.user.Role_object_id==''){
            console.log(sess.user_data.user['email']);
            let first_letter=sess.user_data.user.username.split('');
            res.render('createproject3n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'none'});
          }else if(sess.user_data.role_Data.org_name!=''){
            console.log(sess.user_data.role_Data.org_name);
            let first_letter=sess.user_data.user.username.split('');
            if(sess.user_data.user.Role.is10DemProuser==true||sess.user_data.user.Role.isEducator==true){
              res.render('createproject3n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator'});
            }
            else{
              res.render('createproject3n',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org'});
            }
          }
        }
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*################################# 
  ###Create project post requests## 
  ################################# */
var project_id='';
app.post('/addproject/:id',upload.array('attachedfiles',5),function(req,res){
  
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log('Project id:'+ project_id);
    console.log(req.body);
    if(req.params.id==1){
        console.log(req.body);
        let projectdata={
          project_title:req.body.project_title,
          subject:req.body.subject,
          project_summary:req.body.summary,
          created_by:sess.user_data.user._id,
        }
        project.create(projectdata,function(err,project){
          if(err){
            console.log('There has been an error: '+err);
            res.render("somethingWrong",{error:err})
          }else{
            project_id=project._id;
            let finalproject=sess.user_data.user.Projects;
            finalproject.push(project._id);
            let obj={
              Projects:finalproject,
            }
            user.findOneAndUpdate({_id:sess.user_data.user._id},{$set:obj},{new:true},function(err,resp){
              sess.user_data.user=resp;
              console.log('User updated successfully '+sess.user_data.user);
              console.log('project create successfully: '+project);
              res.redirect('/home/createproject/2');
            })
          }
        })
    }else if(req.params.id==2){
      console.log(req.body);
      let data_to_be_updated={
          grade:req.body.grade,
          learning_outcome:req.body.learning_outcome,
          key_contribution:req.body.contribution
      };
      console.log('Project id: '+ project_id);
      project.findOneAndUpdate({_id:project_id},{$set:data_to_be_updated},{new:true},function(err,resp){
        if(err){
          console.log('Inside post req from createproject2n and cant update project :- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Project updated redirecting to createproject3n: '+util.inspect(resp));
          res.redirect('/home/createproject/3');
        }
      })
    }
    else if(req.params.id==3){
      console.log(req.body);
      console.log("##############################################\n"+util.inspect(req.files)+"\n#########################################\n");
      let attachedfiles=[];
      req.files.forEach((file)=>{
        console.log(file.path);
        attachedfiles.push({
          file:file.path,
          userid:sess.user_data.user._id,
        });
      })
      console.log("Attached files after for loop:- "+util.inspect(attachedfiles));
      let data_to_be_updated={
        details_activity:req.body.Detailsandactivity,
        attached_files:attachedfiles,
        assigned_to:req.body.assigned_to,
        start_date:req.body.startDate,
        end_date:req.body.endDate,
        status:true,
      };
      project.findOneAndUpdate({_id:project_id},{$set:data_to_be_updated},{new:true},function(err,resp){
        if(err){
          console.log('Inside post req from createproject3n and cant update project:- '+ err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Project created with all this data and then redirecting to preview page:- ' + resp);
          res.redirect('/projectpreview/'+project_id);
        }
      })
    }
  }
})



/*#################################
  ####Updating Created Project#####
  ################################# */
app.post('/updating/:id/:number',function(req,res){
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    if(req.params.number==1){
      console.log('Inside updating created project number 1:- '+util.inspect(req.body));
      project.findOneAndUpdate({_id:req.params.id},{$set:req.body},{new:true},function(err,resp){
      if(err){
        console.log('Inside Updating Created Projects getting this error:- '+err);
        res.render("somethingWrong",{error:err})
      }else{
        console.log('Redirecting from updating created projects to project preview.');
          res.redirect('/myprojects');  
      }
    })
    }
    else if(req.params.number==2){
      console.log('Inside updating created project number 2:- '+util.inspect(req.body));
      project.find({_id:req.params.id},function(err,resp){
        let attached_files_now=resp[0].attached_files;
        console.log('Attached files in system before appending new data:- '+attached_files_now);
        let comments_now=resp[0].comments;
        console.log('Comments in system before appending new data:- '+comments_now);
        attached_files_now.push({
          userid:sess.user_data.user._id,
          file:req.body.attached_files
        });
        console.log('Attached files in system after appending new data:- '+attached_files_now);
        comments_now.push({
          message:req.body.comment,
          userid:sess.user_data.user._id
        })
        console.log('Comments in system before appending new data:- '+comments_now);
        let obj={
          attached_files:attached_files_now,
          comments:comments_now
        }
        project.findOneAndUpdate({_id:req.params.id},{$set:obj},{new:true},function(err,resp){
          console.log(resp);
          res.redirect('/previewofproject/'+req.params.id);
        })
      })
    }
  }
})
/*#################################
  ########EDITING PROJECTS#########
  ################################# */
  
app.get('/editproject/:id',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      project.find({_id:req.params.id},function(err,resp){
        if(err){
          console.log('In project preview got this error:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          let first_letter=sess.user_data.user.username.split('');
          let attachedfiles=[];
          resp[0].attached_files.forEach(function(attached_file){
            if(attached_file.userid==sess.user_data.user._id){
              attachedfiles.push(attached_file.file);
            }
          })
          if(sess.user_data.user.Role_object_id==''){
            console.log('Project data:- '+resp[0]);
            res.render('editproject',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:true,role:'none',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }else if(sess.user_data.user.Role.is10DemProuser==true||sess.user_data.user.Role.isEducator==true){
            console.log('Project data:- '+resp[0]);
            res.render('editproject',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:false,role:'educator',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }else{
            console.log('Project data:- '+resp[0]);
            res.render('editproject',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:false,role:'org',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*#################################
  #######Project Preview 2###########
  ################################# */
app.get('/viewproject/:id',async function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      project.find({_id:req.params.id},async function(err,resp){
        if(err){
          console.log('In project preview got this error:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          var data = await user.find({_id:resp[0].created_by})
          console.log("data is", data)
          let first_letter=sess.user_data.user.username.split('');
          let attachedfiles=[];
          resp[0].attached_files.forEach(function(attached_file){
            if(attached_file.userid==sess.user_data.user._id){
              attachedfiles.push(attached_file.file);
            }
          })
          if(sess.user_data.user.Role_object_id==''){
            console.log('Project data:- '+resp[0]);
            res.render('adminECview',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:true,role:'none',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date,data:data});
          }else if(sess.user_data.user.Role.is10DemProuser==true||sess.user_data.user.Role.isEducator==true){
            console.log('Project data:- '+resp[0]);
            res.render('adminECview',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:false,role:'educator',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date,data:data});
          }else{
            console.log('Project data:- '+resp[0]);
            res.render('adminECview',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:false,role:'org',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date,data:data});
          }
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*#################################
  #######Project Preview###########
  ################################# */
app.get('/projectpreview/:id',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      project.find({_id:req.params.id},function(err,resp){
        if(err){
          console.log('In project preview got this error:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          let first_letter=sess.user_data.user.username.split('');
          let attachedfiles=[];
          resp[0].attached_files.forEach(function(attached_file){
            if(attached_file.userid==sess.user_data.user._id){
              attachedfiles.push(attached_file.file);
            }
          })
          if(sess.user_data.user.Role_object_id==''){
            console.log('Project data:- '+resp[0]);
            res.render('projectpreview2n',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:true,role:'none',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }else if(sess.user_data.user.Role.is10DemProuser==true||sess.user_data.user.Role.isEducator==true){
            console.log('Project data:- '+resp[0]);
            res.render('projectpreview2n',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:false,role:'educator',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }else{
            console.log('Project data:- '+resp[0]);
            res.render('projectpreview2n',{firstletter:first_letter[0],projectidforurl:req.params.id,hide_manage_students:false,role:'org',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*#################################
  #############Bookmarks###########
  ################################# */
app.get('/bookmarks',function(req,res){
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    let count=0;
    var projects_to_be_shown=[];
    let first_letter = sess.user_data.user.username.split('');
    console.log('Getting some kind of req!');
    if(sess.user_data.user.Bookmarks.length==0){
      if(sess.user_data.user.Role.is10DemProuser){
        res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',projects:[]});
      }else if(sess.user_data.user.Role.isEducator){
        res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',projects:[]});
      }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
        res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:[]});
      }else{
        res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',projects:[]});
      }
    }else{
      sess.user_data.user.Bookmarks.forEach(function(bookmark){
        project.find({_id:bookmark},function(err,resp){
          if(err){
            console.log('Cannot find bookmarks :- '+err);
            res.render("somethingWrong",{error:err})
          }else{
            projects_to_be_shown[projects_to_be_shown.length]=resp[0];
            count++;
            console.log(sess.user_data.user.Bookmarks.length+' '+count);
            if(sess.user_data.user.Bookmarks.length==count){
              console.log('All projects being sent to myprojects:- '+util.inspect(projects_to_be_shown));
              if(sess.user_data.user.Role.is10DemProuser){
                res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:'',role:'educator',projects:projects_to_be_shown});
              }else if(sess.user_data.user.Role.isEducator){
                res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'educator',projects:projects_to_be_shown});
              }else if(sess.user_data.user.Role.isNPOrg||sess.user_data.user.Role.isOrg){
                res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:false,org_name:sess.user_data.role_Data.org_name,role:'org',projects:projects_to_be_shown});
              }else{
                res.render('bookmarks',{name:sess.user_data.user.username,firstletter:first_letter[0],hide_manage_students:true,org_name:'',role:'',projects:projects_to_be_shown});
              }
            }
          }
        })
      })
    }
  }
 }).catch(()=>{res.render("noInternet")})
})
/*################################
  #########Adding Bookmarks#######
  ################################ */
app.get('/addbookmark/:id',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      console.log('req.params:- ',req.params);
      let bookmarks_now=sess.user_data.user.Bookmarks;
      bookmarks_now.push(req.params.id);
      let bookmark_update = {
        Bookmarks:bookmarks_now
      }
      user.findOneAndUpdate({_id:sess.user_data.user._id},{$set:bookmark_update},{new:true},function(err,resp){
        if(err){
          console.log('Cannot update the user:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Bookmark added:- '+resp);
          sess.user_data.user=resp;
          console.log('Current sess user data:- '+ sess.user_data.user);
          res.redirect('/bookmarks');
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})


/*#################################
  #########Sending Invites#########
  ################################# */
app.post('/sendinginvites',function(req,res){
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log('Incoming transmission:- '+util.inspect(req.body));
    user.find({},function(err,resp){
      if(err){
        console.log('Inside sending invited cannot find users:- '+err);
        res.render("somethingWrong",{error:err})
      }else{
        let collaborators=[];
        for(let i=0;i<resp.length;i++){
          console.log(resp[i]._id.equals(sess.user_data.user._id));
          if(!resp[i]._id.equals(sess.user_data.user._id)){
            let current_notifications=resp[i].notifications;
            current_notifications.push({
              message:req.body.message,
              time:Date.now(),
              user_id:sess.user_data.user._id,
              project_id:project_id,
            });
            collaborators.push({
              user_id:resp[i]._id
            })
            let notification_updates={
              notifications:current_notifications,
            };
            user.findOneAndUpdate({_id:resp[i]._id},{$set:notification_updates},{new:true},function(err,respo){
              if(err){
                console.log('Error in finding and updating notifications:- '+err);
                res.render("somethingWrong",{error:err})
              }else{
                console.log('done');
              }
            })
          }
        }
        console.log('Current collabs with appending '+util.inspect(collaborators))
        let collabs_to_be_updated={
          collaboration:collaborators
        }
        project.findOneAndUpdate({_id:project_id},{$set:collabs_to_be_updated},{new:true},function(err,resp){
          if(err){
            console.log('Cannot update project after finding it:- ' + err);
            res.render("somethingWrong",{error:err})
          }else{
            console.log('Collaboration added:- '+resp);
            res.redirect('/externalcollab');
          }
        })
      }
    })
  }
})
/*################################# 
  ##########MEMBERSHIPS############
  ################################# */
app.get('/membershipnonprofit',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      if(sess.user_data.user.Role_object_id==''){
        let first_letter=sess.user_data.user.username.split('');
        res.render('membershipnonprofit',{firstletter:first_letter[0]});
      }else{
        res.send('<h1>Not ready yet!</h1>');
      }
    }  
  }).catch(()=>{
    res.render("noInternet")
  })
  
})
app.get('/membershiporganization',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      if(sess.user_data.user.Role_object_id==''){
        let first_letter=sess.user_data.user.username.split('');
        res.render('membershiporganization',{firstletter:first_letter[0]});
      }else{
        res.send('<h1>Not ready yet!</h1>');
      }
    }  
  }).catch(()=>{
    res.render("noInternet")
  })
})
app.get('/membershippro',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      if(sess.user_data.user.Role_object_id==''){
        let first_letter=sess.user_data.user.username.split('');
        res.render('membershippro',{firstletter:first_letter[0]});
      }else{
        res.send('<h1>Not ready yet!</h1>');
      }
    }  
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*################################# 
  ############PAYMENTS#############
  ################################# */
app.get('/payment/:id',function(req,res){
  console.log('In here'+req.params.id);
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    if(req.params.id==0){
      res.render('payment',{id:req.params.id,membershipname:'10Dem Pro', price:500,name:sess.user_data.user.username,email:sess.user_data.user.email})
    }else if(req.params.id==1){
      res.render('payment',{id:req.params.id,membershipname:'Organization', price:800,name:sess.user_data.user.username,email:sess.user_data.user.email})
    }else {
      res.render('payment',{id:req.params.id,membershipname:'Non- profit Organization', price:0,name:sess.user_data.user.username,email:sess.user_data.user.email})
    }
  }
 }).catch(()=>{
   res.render("noInternet")
 })
})




/*################################# 
  ########ASSIGNING ROLES##########
  ################################# */
app.post('/role/:id',function(req,res){
  console.log(util.inspect(req.body)+util.inspect(req.params));
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    if(req.params.id==0){
      let obj={
        verification_status:true,
        org_name:req.body.Org_name,
        phone_number:req.body.number,
        country:req.body.country,
      };
      educatoror10dempro.create(obj,function(err,educatorordempro){
        if(err){
          console.log('In /role/:id creating educatoror10Dempro and error is: '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Educatoror10dempro user created! with this data:- '+educatorordempro);
          let update={
            username:req.body.Name,
            email:req.body.email,
            'Role.is10DemProuser':true,
            Role_object_id:educatorordempro._id,
          };
          user.findOneAndUpdate({email:sess.user_data.user.email},{$set:update},{new:true},function(err,updatedresult){
            if(err){
              console.log('In /role/:id updating user and error is: '+util.inspect(err));
              res.render("somethingWrong",{error:err})
            }else{
              user.find({_id:updatedresult._id},function(err,actual_data_of_user){
                console.log('User updated after creating educatorordempro user '+actual_data_of_user);
                sess.user_data.user=actual_data_of_user[0];
                sess.user_data.role_Data=educatorordempro;
                console.log('Session created: '+sess.user_data.user+sess.user_data.role_Data);
                res.redirect('/home/');
              })              
            }
          })
        }
      })

    }
    else if(req.params.id==1){
      let obj={
        org_name:req.body.Org_name,
        phone_Number:req.body.number,
        country:req.body.country,
      };
      console.log('Object just before creating P Org:- '+ util.inspect(obj));
      PorNPORG.create(obj,function(err,Org){
        if(err){
          console.log('In /role/:id creating Org and error is: '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Org user created! with this data:- '+Org);
          let update={
            username:req.body.Name,
            email:req.body.email,
            'Role.isOrg':true,
            Role_object_id:Org._id,
          };
          user.findOneAndUpdate({username:sess.user_data.user.username},{$set:update},{new:true},function(err,updatedresult){
            if(err){
              console.log('In /role/:id updating user and error is: '+util.inspect(err));
              res.render("somethingWrong",{error:err})
            }else{
              user.find({_id:updatedresult._id},function(err,actual_data_of_user){
                console.log('User updated after creating Org user '+actual_data_of_user);
                sess.user_data.user=actual_data_of_user[0];
                sess.user_data.role_Data=Org;
                console.log('Session created: '+sess.user_data.user+sess.user_data.role_Data);
                res.redirect('/home/');
              })              
            }
          })
        }
      })

    }
    else if(req.params.id==2){
      let obj={
        verification_status:true,
        org_name:req.body.Org_name,
        phone_Number:req.body.number,
        country:req.body.country,
      };
      PorNPORG.create(obj,function(err,NPOrg){
        if(err){
          console.log('In /role/:id creating Non-Profit Org and error is: '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Non-Profit Org user created! with this data:- '+NPOrg);
          let update={
            username:req.body.Name,
            email:req.body.email,
            'Role.isNPOrg':true,
            Role_object_id:NPOrg._id,
          };
          user.findOneAndUpdate({username:sess.user_data.user.username},{$set:update},{new:true},function(err,updatedresult){
            if(err){
              console.log('In /role/:id updating user and error is: '+util.inspect(err));
              res.render("somethingWrong",{error:err})
            }else{
              user.find({_id:updatedresult._id},function(err,actual_data_of_user){
                console.log('User updated after creating NPOrg user '+actual_data_of_user);
                sess.user_data.user=actual_data_of_user;
                sess.user_data.role_Data=NPOrg;
                console.log('Session created: '+sess.user_data.user+sess.user_data.role_Data);
                res.redirect('/home/');
              })              
            }
          })
        }
      })

    }
  }
})



/*################################
  ########PROJECT PREVIEW#########
  ################################ */
app.get('/previewofproject/:id',function(req,res){
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      project.find({_id:req.params.id},function(err,resp){
        if(err){
          console.log('Cannot find any project error:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          let first_letter=sess.user_data.user.username.split('');
          let attachedfiles=[];
          resp[0].attached_files.forEach(function(attached_file){
            if(attached_file.userid==sess.user_data.user._id){
              attachedfiles.push(attached_file.file);
            }
          })
          if(sess.user_data.user.Role_object_id==''){
            console.log('Attached files being sent:- '+attachedfiles);
            res.render('projectoverview',{sessuserid:sess.user_data.user._id,firstletter:first_letter[0],name:sess.user_data.user.username,projectidforurl:req.params.id,hide_manage_students:true,role:'none',org_name:'',title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }else if(sess.user_data.user.Role.is10DemProuser||sess.user_data.user.Role.isEducator){
            console.log('Attached files being sent:- '+attachedfiles);
            res.render('projectoverview',{sessuserid:sess.user_data.user._id,firstletter:first_letter[0],name:sess.user_data.user.username,projectidforurl:req.params.id,hide_manage_students:false,role:'educator',org_name:sess.user_data.role_Data.org_name,title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }else{
            console.log('Attached files being sent:- '+attachedfiles);
            res.render('projectoverview',{sessuserid:sess.user_data.user._id,firstletter:first_letter[0],name:sess.user_data.user.username,projectidforurl:req.params.id,hide_manage_students:false,role:'org',org_name:sess.user_data.role_Data.org_name,title:resp[0].project_title,subject:resp[0].subject,grade:resp[0].grade,summary:resp[0].project_summary,learningoutcome:resp[0].learning_outcome,keycontri:resp[0].key_contribution,detailsactivity:resp[0].details_activity,files:attachedfiles,startdate:resp[0].start_date,enddate:resp[0].end_date});
          }
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*##################################
  #######10 Dem Project View########
  ################################## */
app.get('/10DemProjectView/:id',(req,res)=>{
  internetConnected().then(()=>{
    if(sess.user_data==undefined){
      res.redirect('/');
    }else{
      superadminProject.find({_id:req.params.id},function(err,resp){
        if(err){
          console.log('Error finding superadmin project because:- '+err);
          res.render("somethingWrong",{error:err})
        }else{
          console.log('Going project is :- '+resp);
          res.render('superadminViewProject',{projectdata:resp[0]});
        }
      })
    }
  }).catch(()=>{
    res.render("noInternet")
  })
})
/*##################################
  #########10 Dem Downloads#########
  ################################## */
app.get('/download-file/:file',(req,res)=>{
 internetConnected().then(()=>{
  if(sess.user_data==undefined){
    res.redirect('/');
  }else{
    console.log(__dirname+'/public/uploads/'+req.params.file);
    res.download(__dirname+'/public/uploads/'+req.params.file);
  }
 }).catch(()=>{
   res.render("noInternet")
 })
})


  /*################################# 
  ##Server listening at Port 3000##
  ################################# */
const PORT = process.env.PORT || 3000;
app.listen(PORT,function(){
    console.log("Yeah I am connected"+PORT);
  });
  
  module.exports = app;
