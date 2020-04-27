// jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const rp = require("request-promise");
const $ = require("cheerio");
const nodemailer = require("nodemailer");
const forever = require('forever-monitor');

let app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// DEFINING THE DB

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const emailSchema = new mongoose.Schema({
  email: String
});
const Email = new mongoose.model("Email", emailSchema);

// VARIABLES USED THROUGHOUT
let notices, noticesLinks, news, newsLinks, emailArray = [],
  latestNotice = [],
  latestNews = [],
  latestNoticeString,
  latestNewsString,
  nLink,
  lLink,
  image,
  noticesImageType,
  newsImageType;

// NODEMAILER CONFIG
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayushshanker23@gmail.com',
    pass: process.env.APP_PASS
  }
});


// NOTICES SECTION
rp('http://www.msit.in/notices')
  .then(function(html) {
    //GRABBING THE NEW GIF LINK
    image = ($('.tab-content li img ', html).attr('src'));
    noticesImageType = (typeof image);

    notices = $('.tab-content ul li ', html).text();

    // GRABBING THE LATEST NOTICE(present after 50 spaces)
    for (let i = 50; i < 100; i++) {
      latestNotice[i] = notices[i];
    }
    // CONVERTING THE ARRAY OF LATEST NOTICE INTO A STRING
    latestNoticeString = latestNotice.join("");

    // SCRAPING THE NOTICE'S LINK
    noticesLinks = ("http://www.msit.in" + $(".tab-content ul li a ", html).attr("href"));

    nLink = latestNoticeString + noticesLinks;
    // SEARCHING DB FOR REGISTERED SUBSCRIBERS
    Email.find((err, dbArray) => {
      if (err) {
        console.log(err);
      } else {
        //CHECK IF THE li TAG HAS A NEW GIF,I.E. THE notice IS NEW
        if (noticesImageType === 'string') {
          //SEND EMAIL TO ALL REGISTERED USERS
          for (let i = 0; i < dbArray.length; i++) {
            // NODEMAILER OPTIONS
            var mailOptions = {
              from: 'ayushshanker23@gmail.com',
              to: dbArray[i].email,
              subject: 'MSIT Latest Notice',
              text: '           NOTICE\n' + nLink,
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
      }
    });
  })
  .catch(function(err) {
    console.log(err);
  });
// NOTICES END

// LATEST NEWS SECTION
rp('http://www.msit.in/latest_news')
  .then(function(html) {
    //GRABBING THE NEW GIF LINK
    image = ($('.tab-content li img ', html).attr('src'));
    newsImageType = (typeof image);

    news = $('.tab-content ul li ', html).text();
    // GRABBING THE LATEST NEWS(present after 75 spaces)
    for (let i = 75; i < 150; i++) {
      latestNews[i] = news[i];
    }
    // CONVERTING THE ARRAY OF LATEST NEWS INTO A STRING
    latestNewsString = latestNews.join("");

    // SCRAPING THE NEWS' LINK
    newsLinks = ("http://www.msit.in" + $(".tab-content ul li a ", html).attr("href"));

    lLink = latestNewsString + newsLinks;
    // SEARCHING DB FOR REGISTERED SUBSCRIBERS
    Email.find((err, dbArray) => {
      if (err) {
        console.log(err);
      } else {
        //CHECK IF THE li TAG HAS A NEW GIF,I.E. THE latest_news IS NEW
        if (newsImageType === 'string') {
          //SEND EMAIL TO ALL REGISTERED USERS
          for (let i = 0; i < dbArray.length; i++) {
            // NODEMAILER OPTIONS
            var mailOptions = {
              from: 'ayushshanker23@gmail.com',
              to: dbArray[i].email,
              subject: 'MSIT Latest News',
              text: '           NEWS\n' + lLink,
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
      }
    });
  })
  .catch(function(err) {
    console.log(err);
  });
// NEWS END

// ROUTES
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", (req, res) => {
  email = req.body.email;
  Email.insertMany({
    email: email
  }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email inserted into db");
      res.render("success");
    }
  });
});
// app.listen(process.env.PORT||3000, (req, res) => {
//   console.log("Server is running on port 3000");
// });
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started successfully");
});
