var packageInfo = require('./package.json');

// Parse command line arguments
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: packageInfo.version,
  addHelp:true,
  description: packageInfo.description
})
parser.addArgument([ '-i', '--insecure' ],{help: 'Start server without https', action: 'storeTrue'})
parser.addArgument([ '-t', '--token' ],{help: 'GCP OAUTH Token', required: true})
var args = parser.parseArgs()
let insecure = args.insecure
let token = args.token

const fetch = require('node-fetch');
const express = require("express");
const subdomain = require('express-subdomain');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(require('helmet')());

http.createServer(app).listen(80);

if(!insecure){
    var options = {
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('fullchain.pem')
      };
    https.createServer(options, app).listen(443);
}

// Add routing logic