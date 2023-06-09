const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(express.static("public")); // to be able to access the cs sand images of the html page which would be local and won't be accessed if not made public static
app.use(bodyParser.urlencoded({ entended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const json = JSON.stringify(data);
  const url = "https://us13.api.mailchimp.com/3.0/lists/fc3a8a907c";
  const options = {
    method: "POST",
    auth: "Bhavya:0c839f959df977f86a53634c213048d8-us13",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(json);
  request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(3000 || process.env.PORT, function (req, res) {
  console.log("The server port is 3000");
});

//0c839f959df977f86a53634c213048d8-us13 - appid

//fc3a8a907c - Mailchimp audience key
