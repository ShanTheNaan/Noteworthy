var packageInfo = require('./package.json');

// Parse command line arguments
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: packageInfo.version,
  addHelp:true,
  description: packageInfo.description
})
parser.addArgument([ '-i', '--insecure' ],{help: 'Start server without https', action: 'storeTrue'})
var args = parser.parseArgs()
let insecure = args.insecure

const firebase = require("firebase")
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");
require("firebase/storage")
const firebaseConfig = require("./firebase-auth")
var admin = require('firebase-admin');
admin.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig)
var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true});
var storage = firebase.storage().ref();

const fetch = require('node-fetch');
const express = require("express");
const subdomain = require('express-subdomain');
const http = require('http');
const httpProxy = require('http-proxy');
const https = require('https');
const fs = require('fs');
const path = require('path')
var uniqid = require('uniqid');

const app = express();
app.use(require('helmet')());

http.createServer(app).listen(80);
var proxy  = httpProxy.createProxyServer();

if(!insecure){
    app.use(require('express-force-ssl'))
    var options = {
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('fullchain.pem')
      };
    https.createServer(options, app).listen(443);
}

function addNote(className, date, author, file){
    let id = uniqid()
    return db.collection("notes").doc(id).set({
        className: className,
        date: date
    }).then(response =>{
        return storage.child(id).put(file)
    })
}

function authorize(id){
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            var uid = decodedToken.uid;
            return uid
        }).catch(function(error) {
            return undefined
        });
}

app.use(express.static(path.join(__dirname, "../backup")));

app.get('/api/*', (req, res) => {
    if(("auth" in req.query)){
        authorize(req.query.auth).then(uid => {
            if (uid != undefined){
                req.uid = uid // Append uid to request
                return next()
            }else{
                res.sendStatus(401)
            }
        })
    }else{
        res.sendStatus(401)
    }
});
app.get('/api/newCourse', (req, res) => {
    if("name" in req.query){
        // Call newCourse
    }else{
        req.sendStatus(400)
    }
});
app.get('/api/classes', (req, res) => {
    // Return class list
});
app.get('/api/notes', (req, res) => {
    if("course" in req.query){
        // Call getNotes
    }else{
        req.sendStatus(400)
    }
});
app.post('/api/upload', (req, res) => {
    let className = req.query.name;
    let date = req.query.date;
    let author = req.query.author;
    let file = req.body;

    addNote(className, date, author, file).then(response =>{
        res.sendStatus(201)
    })
});
app.all('*', (req, res, next) => {
    res.redirect("index.html")
});