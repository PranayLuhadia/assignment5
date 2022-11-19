/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Het Vaghela | Student ID: 122547201 | Date: 03 November 2022

* Online (Cyclic) Link: https://kind-tan-betta-slip.cyclic.app
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const userMod = require("./modules/collegeData.js");
var app = express();
app.use(express.static("public"));
// setup a 'route' to listen on the default url path
app.use((req,res,next)=>{

let userAgent=req.get("user-agent");
console.log(userAgent);
next();
})

app.use(express.urlencoded({extended: true}));
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute =
      "/" +
      (isNaN(route.split("/")[1])
        ? route.replace(/\/(?!.*)/, "")
        : route.replace(/\/(.*)/, ""));
    next();
  });
  
  app.engine(
    ".hbs",
    exphbs.engine({
      extname: ".hbs",
      helpers: {
        navLink: function (url, options) {
          return (
            "<li" +
            (url == app.locals.activeRoute
              ? ' class="nav-item active" '
              : ' class="nav-item" ') +
            '><a class="nav-link" href="' +
            url +
            '">' +
            options.fn(this) +
            "</a></li>"
          );
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
      },
    })
  );
  
  app.set("view engine", ".hbs");

   


app.get("/students", (req,res)=>{

    if(req.query.course){
        userMod.getStudentsByCourse(req.query.course).then(data=>{
           res.render("students",{students: data});
            
        }).catch(err=>{
           
            res.json({message:"no results"});
        })
    }else{
        userMod.getAllStudents().then(data=>{
            res.render("students",{students: data}); // or res.send() would work here too
        }).catch(err=>{
            res.senc({message:"no results"}); // show the error to the user
        });
    }
});

// app.get("/tas", (req,res)=>{
//         userMod.getTAs().then(tas=>{
//             res.json(tas); // or res.send() would work here too
//         }).catch(err=>{
//             res.json({message:"no results"}); // show the error to the user
//         });
//    });

   app.get("/courses", (req,res)=>{
    userMod.getCourses().then(data=>{
        res.render("courses", {courses: data}); // or res.send() would work here too
    }).catch(err=>{
        res.render("courses", {message: "no results"}); // show the error to the user
    });
});

app.get("/student/:num", (req,res)=>{
    
    userMod.getStudentByNum(req.params.num).then(data=>{
        res.render("student", { student: data });
    }).catch(err=>{
        
        res.json({message:"no results"}); 
    });
});

app.get("/course/:id", (req,res)=>{
    
    userMod.getCourseById(req.params.id).then(data=>{
        res.render("course", {course: data});
    }).catch(err=>{
        
        res.json({message:"no results"}); 
    });
});



app.get("/", (req,res)=>{
    //res.sendFile(path.join(__dirname, "/views/home.html"));
    res.render("home");
    
});

app.get("/htmlDemo", (req,res)=>{
    //res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    res.render("htmlDemo");
});

app.get("/home", (req,res)=>{
    //res.sendFile(path.join(__dirname, "/views/home.html"));
    res.render("home");
});


app.get("/students/add", (req,res)=>{
    //res.sendFile(path.join(__dirname, "/views/addStudent.html"));
    res.render("addStudent")
});

app.get("/about", (req,res)=>{ 
    
    //res.sendFile(path.join(__dirname, "/views/about.html"));
    res.render("about");
   
});
app.post("/students/add", (req,res)=>{
    req.body.TA = (req.body.TA) ? true : false;   
      userMod.addStudent(req.body).then(()=>{
        res.redirect("/students");
        }).catch((err)=>{
        
        res.json("Error");
    });
    
});
app.post("/student/update", (req, res) => {
    req.body.TA = (req.body.TA) ? true : false;  
    userMod.updateStudent(req.body);
    res.redirect("/students");
   });

app.use((req,res,next)=>{
    res.status(404).render("route");// .sendFile(), .json(), etc or .end() (sends nothing back)
});

userMod.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log("server listening on: " + HTTP_PORT);
    });
}).catch(err=>{
    console.log(err)
});
