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
require("firebase/firestore")
require("firebase/storage")
const firebaseConfig = require("./firebase-auth")
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
var uniqid = require('uniqid');

const app = express();
app.use(require('helmet')());

http.createServer(app).listen(80);
var proxy  = httpProxy.createProxyServer();

if(!insecure){
    var options = {
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('fullchain.pem')
      };
    https.createServer(options, app).listen(443);
}

function addUser(id, name, email){
    db.collection("users").doc(id).set({
        name: name,
        email: email
    })
}

function addNote(className, date, file){
    let id = uniqid()
    db.collection("notes").doc(id).set({
        className: className,
        date: date
    }).then(response =>{
        return storage.child(id).put(file)
    })
}

app.all('*', (req, res, next) => {
    console.log(req.subdomains)
    if (req.subdomains.length == 0) {
        proxy.web(req, res, {target: 'http://localhost:8080'});
    } else {
        return next();
    }
});

var api = express.Router();
api.all('*', (req, res) => {
    req.setEncoding("<p>hello</p>")
});
app.use(subdomain('api', api));