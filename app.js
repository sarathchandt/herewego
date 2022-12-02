
// const twilioRouter = require("./routes/twilio")
require("dotenv").config();
const Swal = require('sweetalert2')
const { doesNotMatch } = require("assert");
const express=require("express")
let path = require('path');
let mongodb=require("./configure/config")
let cookieParser=require("cookie-parser");
let session =require("express-session");
let multer = require("multer");
// const jsonParser = bodyParser.json();





let app=express();

app.use(function (req, res, next) {
    res.header('Cache-control', "private,no-cache,no-store,must-revalidate")
    next()
  })


  // app.use(jsonParser);
  // app.use("/twilio",twilioRouter);

let userlogin=require("./routes/user")
let adminlogin=require("./routes/admin") 

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use("public/images/product",express.static(path.join(__dirname, 'public/images/product')));

const filestorage = multer.diskStorage({
 
  destination: (req,file,callback)=>{
    callback (null,"public/images/product")
  },
  filename : (req,file,callback)=>{
    
    callback(null,file.fieldname +"-"+ Date.now()+path.extname(file.originalname))
   
  }
});
app.use(multer({dest:"public/images/product", storage : filestorage}).single("image"))


// app.use(fileUpload());
app.use(cookieParser());
app.use(session({secret:"kjhgfdsa",saveUninitialized:true,resave:true,  cookie: { maxAge: 6000000} }))



app.use("/",userlogin);
app.use("/admin",adminlogin);
app.use("*",(req,res)=>{
  res.render("err");
})




mongodb.connect((err)=>{
    if(err) console.log("connection error"+ err);
    console.log("database connected");
})


// app.set('views', path.join(__dirname, 'views'));




app.listen(9000); 