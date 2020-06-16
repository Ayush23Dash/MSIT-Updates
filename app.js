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

const newsSchema = new mongoose.Schema({
  data:String
});

const noticesSchema = new mongoose.Schema({
  data:String
});

const Email = new mongoose.model("Email", emailSchema);
const NewsModel = new mongoose.model("News",newsSchema);
const NoticesModel = new mongoose.model("notices",noticesSchema);

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
    // NoticesModel.insertMany({
    //   data: nLink
    // }, (err) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("Notice inserted into db");
    //   }
    // });
    if (noticesImageType === 'string') {
      //RESTART SERVER ONCE, IF WE HAVE A NEW notice
      // shut();
      // start();

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

      NoticesModel.find({},(err,results) => {
        if(err){
          console.log(err);
        }else{
          if(nLink === results[0].data){
            console.log("Same Notice");
          }else{
            console.log("Different Notices");
            NoticesModel.findByIdAndUpdate({_id:"5ee8eda672ca5b3c90b3d158"},{
              data:nLink
            },(err,result) => {
              if(err){
                console.log(err);
              }else{
                console.log("Notices Updated");
              }
            });
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
                      text: '           NOTICE\n' + nLink +'\n\nIt is highly recommended to check msit.in/notices for more information',
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
          }
        }
      });

    }
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

    if (newsImageType === 'string') {
      //RESTART SERVER ONCE, IF WE HAVE A NEW latest_news
      // shut();
      // start();
      // process.exit();
      // start();

      news = $('.tab-content ul li ', html).text();
      // GRABBING THE LATEST NEWS(present after 75 spaces)
      for (let i = 75; i < 240; i++) {
        latestNews[i] = news[i];
      }
      // CONVERTING THE ARRAY OF LATEST NEWS INTO A STRING
      latestNewsString = latestNews.join("");

      // SCRAPING THE NEWS' LINK
      newsLinks = ("http://www.msit.in" + $(".tab-content ul li a ", html).attr("href"));

      lLink = latestNewsString + newsLinks;
      // NewsModel.insertMany({
      //   data: lLink
      // }, (err) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("News inserted into db");
      //   }
      // });
      NewsModel.find({},(err,results) => {
        if(err){
          console.log(err);
        }else{
          if(lLink === results[0].data){
            console.log("Same News");
          }else{
            console.log("Different News");
            // UPDATE OLD NEWS WITH NEW NEWS
            NewsModel.findByIdAndUpdate({_id:"5ee8d98bcfa33b2e142d466b"},{
              data:lLink
            },(err,result) => {
              if(err){
                console.log(err);
              }else{
                console.log("News Updated");
              }
            });
            // SEARCHING DB FOR REGISTERED SUBSCRIBERS
            Email.find((err, dbArray) => {
              if (err) {
                console.log(err);
              } else {
                //CHECK IF THE li TAG HAS A NEW GIF,I.E. THE latest_news IS NEW
                if (newsImageType === 'string') {
                  // shut();
                  // start();
                  // console.log("in news");
                  //SEND EMAIL TO ALL REGISTERED USERS
                  for (let i = 0; i < dbArray.length; i++) {
                    // NODEMAILER OPTIONS
                    var mailOptions = {
                      from: 'ayushshanker23@gmail.com',
                      to: dbArray[i].email,
                      subject: 'MSIT Latest News',
                      text: '           NEWS\n' + lLink +'\n\nIt is highly recommended to check msit.in/latest_news for more information',
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
          }
        }
      });


    }
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
      // start();
      // shut();
      res.render("success");
    }
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server started successfully");
});

//FUNCTION TO CLOSE THE SERVER GRACEFULLY
function shut() {
  server.close(() => {
    console.log("Server closed");
  });
}

//FUNCTION TO RESTART THE SERVER
function start() {
  server.on('close', function() {
    server.listen(3000);
    console.log("Server restarted successfully");
  });
}
