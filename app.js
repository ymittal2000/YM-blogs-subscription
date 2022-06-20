// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require('md5');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.server_key,
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const firstName1 = req.body.fName;
  const lastName1 = req.body.lName;
  const email1 = req.body.email;

  const listId = process.env.list_key;
  const subscribingUser = {
    firstName: firstName1,
    lastName: lastName1,
    email: email1
  };
  //const subscriberHash = md5(email1.toLowerCase());


  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    res.sendFile(__dirname + '/success.html');

  }
  run().catch(e=>res.sendFile(__dirname + '/failure.html'));
});

app.post('/failure' , function(req,res){
  res.redirect('/');
});
app.listen(process.env.PORT ||3000, function() {
  console.log('Server running at port 3000');
});
