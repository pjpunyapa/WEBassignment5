/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Punyapa Jongrak____ Student ID: ______113241228________ Date: ______23 March 2023__________
*
*
*  Online (Cycliic) Link: _____https://sleepy-ant-sandals.cyclic.app/_______________________________________
*
********************************************************************************/ 



var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require("express-handlebars");
var app = express();
const cd = require('./modules/collegedata.js');
const bodyParser = require("body-parser");
// set up the link to college data.js


app.set("views", __dirname + "/views");
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
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
      },
    },
  })
);
app.set("view engine", ".hbs");
app.use(express.static('public'))
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));


// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/student/add", (req, res) => {
    res.render("addStudent");
});
  
app.post("/student/add", (req, res) => {
  return comData.addStudent(req.body).then((response) => {
    if (response) {
      res.redirect("/students");
    }
  }).catch((error) => {
    console.log(error)
  });
});

//JSON formatted string containing all of the students resolved from the getAllStudents function 
// setup to listen from main
app.get("/students", (req, res) => {
  const pquery = parseInt(req.query.course);
  const allStudents = cd.getAllStudents().then((data) => {
    if (pquery) {
        cd.getStudentsByCourse(pquery).then((item) => {
          return res.render("students", { students: item });
        });
      } else {
        return res.render("students", {students: data});
      }
    })
    .catch((error) => {
      return res.render("students", { message: "No results returned" });
    });
});
//JSON formatted string containing all of the managers resolved from the getTAs function 
app.get("/tas",(req,res)=>{
    cd.getAs().then(taData => {
        res.send(taData);
      });
});
//JSON formatted string containing all of the courses resolved from the getCourses function 
app.get("/courses",(req,res)=>{
    cd.getCourses().then(courseData => {
        return res.render("courses", { courses: courseData });
      });
});

app.get("/course/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id) {
    cd.getCourseById(id).then((data) => {
      return res.render("course", { course: data });
    });
  } else {
    return res.send("Sorry, value is not an integer");
  }
});

app.post("/student/update", (req, res) => {
  cd.updateStudent(req.body);
  res.redirect("/students");
});


//a JSON formatted string containing a single student whose studentNum property matches the num parameter in the route
app.get("/students/:num",(req,res)=>{
    var num = req.params.num;
    var numValue = parseInt(num);
    cd.getStudentByNum(numValue).then(studentData => {
        return res.render("student", { student: studentData });
      });
  
});




app.get('*', function(req, res){
    res.status(404).send('PAGE NOT FOUND!!!!');
  });
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)
cd.initilize()
});
