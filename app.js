// jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const rp = require("request-promise");
const $ = require("cheerio");
const nodemailer = require("nodemailer");

let app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// DEFINING THE DB
mongoose.connect("mongodb://localhost:27017/emailDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const emailSchema = new mongoose.Schema({
  email:String
});

const Email = new mongoose.model("Email",emailSchema);
// rp('http://www.msit.in/notices', (err,res,body) => {
//   let $ = cheerio.load(body);
//   let a = $('.tab-content');
//   // console.log(a[0].children[0].next.children[0].parent.parent.children[1].children[1].children[0]);
//   console.log(a[0].children[1].children[0].parent.children[1].children[1].children[0].data);
//   console.log(a[0].children[1].children[0]);
//
// });
var notices, noticesLinks, latestNews,emailArray=[];


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayushshanker23@gmail.com',
    pass: process.env.APP_PASSWORD
  }
});



// LATEST NEWS SECTION
// rp('http://www.msit.in/latest_news')
//   .then(function(html) {
//     //success!
//     latestNews = ($('.tab-content li ', html).text());
//     // console.log(latestNews);
//     var mailOptions = {
//       from: 'ayushshanker23@gmail.com',
//       to: 'ayushshankar@rediffmail.com',
//       subject: 'MSIT Latest News',
//       text: '                        LATEST NEWS\n' + latestNews,
//     };
//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

// ROUTES
  app.get("/",(req,res) => {
    res.render("home");
    // NOTICES SECTION
    rp('http://www.msit.in/notices')
      .then(function(html) {
      notices = ($('.tab-content ul li ', html).text());
    // console.log(notices);
        $(".tab-content ul", html).find('a').map(function() {
          noticesLinks = ("msit.in" + $(this).attr('href'));
          // console.log(noticesLinks);
        }
      );
      Email.find((err,dbArray)=>{
        if(err){
          console.log(err);
        }else{
          for(let i=0;i<dbArray.length;i++){
          var mailOptions = {
            from: 'ayushshanker23@gmail.com',
            to: dbArray[i].email,
            subject: 'MSIT Notices',
            text: '                         NOTICES\n' + notices,
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
        }
      });
      })
      .catch(function(err) {
        console.log(err);
      });
      // NOTICES END
  });


  app.post("/",(req,res) => {
     email = req.body.email;
     Email.insertMany({email:email},(err) => {
       if(err){
         console.log(err);
       }else{
         console.log("Email inserted into db");
         res.render("success");
       }
     });
  });
app.listen(3000,(req,res) => {
  console.log("Server is running on port 3000");
});
