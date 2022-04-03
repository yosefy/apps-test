import express from "express";
// import { MongoClient } from "mongodb";
import fs from "fs";

const url = "mongodb://root:example@localhost:27017/";

const phonesDbFile = "phone-data.json";
let rawPhoneData = fs.readFileSync(phonesDbFile);
let phoneData = JSON.parse(rawPhoneData);

const freeEmailProviders = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "walla.co.il",
];

const app = express();
const port = 8081;

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());

app.post("/hi", (req, res) => {
  const enreached = req.body.map((e) => {
    switch (e.type) {
      case "phone":
        e.phoneCountries = phoneCountries(e.fieldValue);
        return e;
      case "email":
        e.emailType = emailIsFree(e.fieldValue);
        return e;
      default:
        console.log(`Sorry, we are out of ${e.type}.`);
      return e;
    }

    // MongoClient.connect(url, function (err, db) {
    //   if (err) throw err;
    //   var dbo = db.db("test");
    //   dbo.collection("queries").insertMany({ data: req.body }, function (err) {
    //     if (err) throw err;
    //     console.log("1 document inserted");
    //     db.close();
    //   });
    // });

    // return req.body;
  });

  console.log(req.body);
  res.send(req.body);

});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

function emailIsFree(email) {
  if (freeEmailProviders.some((e) => email.endsWith(e))) {
    return "free";
  }
  return "corporate";
}

function phoneCountries(phone) {
  const ph = phoneData.filter((e) => phone.startsWith(e["dial_code"]));
  return ph.map((e) => e.name);
}
