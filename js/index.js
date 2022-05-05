const mysql = require("mysql");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "shhhh, very secret",
   
  })
);

let adatok = {user:"" };

let csatlakozas = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "konyvek",
});

csatlakozas.connect(() => {
  console.log("Sikeres kapcsolat!");
});

app.listen("3000");

app.get("/", (req, valasz) => {
  console.log(adatok.user)
  valasz.sendFile(path.join(__dirname, "../views/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

//Összes könyv
app.get("/konyvek", (keres, valasz) => {
  let sql = "SELECT * FROM konyv";
  csatlakozas.query(sql, (hiba, eredmeny) => {
    if (hiba) throw hiba;
    valasz.send(eredmeny);
  });
});

//Új könyv felvétele
app.post("/konyvek", function (req, res) {
  var cim = req.body.cim;
  var ertekeles = req.body.ertekeles;
  var kep = req.body.kep;
  let sql = `INSERT INTO konyv SET ?`;
  csatlakozas.query(
    sql,
    { id: 0, cim: cim, kep: kep, ertekeles: ertekeles },
    function (err, result) {
      if (err) throw err;
      res.send(req.body);
    }
  );
});

//Könyv frissítése
app.post("/konyvek/:konyv", (req, res) => {
  let konyv = req.params;
  let ujkonyv = req.body;
  var cim = req.body.cim;
  var ertekeles = req.body.ertekeles;
  var kep = req.body.kep;
  let sql = `UPDATE konyv konyv SET ? where ID =` + ujkonyv.id;

  csatlakozas.query(
    sql,
    { id: ujkonyv.id, cim: cim, kep: kep, ertekeles: ertekeles },
    function (err, result) {
      if (err) throw err;
      res.send(req.body);
    }
  );
});

//Könyv törlése
app.delete("/konyvek/:id", function (req, res) {
  let sql = `DELETE FROM konyv where ID = ` + req.params.id;
  csatlakozas.query(sql, function (err, result) {
    if (err) throw err;
    res.send("sikeres törlés");
  });
});

//Kereső
app.get("/konyvek/:adat", (req, res) => {
  let keresendo = req.params;
  console.log(keresendo);
  let sql = `Select * from konyv WHERE cim LIKE '%${keresendo.adat}%'`;
  csatlakozas.query(sql, (hiba, eredmeny) => {
    if (hiba) throw hiba;
    console.log(eredmeny);
    res.send(eredmeny);
  });
});


const crypto = require('crypto');

app.post("/login", function (req, res, next) {
  let { user, pass } = req.body;

  let sql = ` SELECT * FROM login where login = '${user}' `;
  csatlakozas.query(sql, (hiba, eredmeny) => {
    if (eredmeny.length > 0) {
      let hash = crypto.createHash("md5").update(pass).digest("hex");
      if (hash == eredmeny[0].password) {
        req.session.regenerate(function () {
          adatok.user = user;
          
          res.send({ redirect: "/",user:user });
          
        });
      }
    }
  });
});

app.get("/logged",(req,res)=>{
  res.send(adatok);
})