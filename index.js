// Includes
const fetch = require('node-fetch');
const express = require("express");
const http = require('http');
const fs = require('fs');
const path = require('path')
const uniqid = require('uniqid');
var getRawBody = require('raw-body')

// Firebase includes
const firebase = require("firebase-admin")
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");
require("firebase/storage")
const {Storage} = require('@google-cloud/storage');

// Setup firebase
var serviceAccount = require("./noteworthy-221403-firebase-adminsdk-mz9td-c065af2621.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: "noteworthy-221403.appspot.com"
});
var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true});
var bucket = firebase.storage().bucket()
col = db.collection("data")

const app = express();
app.set('trust proxy', true);

const PORT = process.env.PORT || 8080;
http.createServer(app).listen(PORT);
console.log("HTTP Listening on port " + PORT)

app.use(function (req, res, next) {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb'
    }, function (err, buf) {
      if (err){
          console.log("Error processing body!")
      }else{
          req.body = buf
      }
      return next()
    })
  })


// BEGIN API FUNCTIONS =========================================

function authorize(req, res, next){
    if(("auth" in req.query)){
        res.locals.uid = req.query.auth
        return next()
    }else{
        res.sendStatus(401)
    }
}

function getCourses(){
    return col.where("isCourse", "==", true)
    .get()
    .then(function(querySnapshot) {
        var courses = []
        querySnapshot.forEach(function(doc) {
            courses.push(doc.data().name)
        });
        return courses
    })
    .catch(function(error) {
        console.log(error)
        return []
    });
}

function addCourse(name, creator){
    return getCourses().then(courses => {
        if(!courses.includes(name)){
            console.log("Adding new class: " + name)
            return col.doc().set({
                isCourse: true,
                creator: creator,
                name: name
            })
            .then(function() {
                return true;
            })
            .catch(function(error) {
                console.log(error)
                return false;
            });
        }
        return false;
    })
}

function addNote(course, date, author, file){
    var fileID = uniqid()
    var fileName = fileID + '.pdf'
    // Upload file first
    return bucket.upload(file, {
        destination: fileName,
        gzip: true,
        public: true
    }).then(response => {
        console.log("Uploaded file: "+file)
        // Then create entry in firestore
        let data = {
            isNote: true,
            course: course,
            date: date,
            link: response[1].mediaLink,
            author: author,
            stars: [author],
            id: fileID
        }
        console.log(data)
        return col.doc().set(data)
        .then(function() {
            return true;
        })
        .catch(function(error) {
            console.log(error)
            return false;
        });
    }).catch(function(error) {
        console.log(error)
        return false;
    });
}

function getDates(course){
    return col.where("isNote", "==", true).where("course", "==", course)
    .get()
    .then(function(querySnapshot) {
        var dates = []
        querySnapshot.forEach(function(doc) {
            var date = doc.data().date
            if(!dates.includes(date)){
                dates.push(date)
            }
        });
        return dates
    })
    .catch(function(error) {
        console.log(error)
        return []
    });
}

function getNotes(course, date){
    return col.where("isNote", "==", true).where("course", "==", course)
    .where("date", "==", date)
    .get()
    .then(function(querySnapshot) {
        var notes = []
        querySnapshot.forEach(function(doc) {
            notes.push(doc.data())
        });
        return notes
    })
    .catch(function(error) {
        console.log(error)
        return []
    });
}

function star(id, user){
    return col.where("id", "==", id)
    .get()
    .then(function(querySnapshot) {
        if(querySnapshot.size != 0) {
            var note = querySnapshot.docs[0]
            if(!note.data().stars.includes(user)){
                return col.doc(note.ref.path.split('/')[1]).update({
                    stars: firebase.firestore.FieldValue.arrayUnion(user)
                }).then(resp => {
                    return true
                })
            }else{
                console.log("Tried to restar!")
                return false
            }
        }else{
            return false
        }
    })
    .catch(function(error) {
        console.log(error)
        return false
    });
}

// END API FUNCTIONS ===========================================


// BEGIN ROUTING ===============================================

app.use(express.static(path.join(__dirname, "static")));

app.get('/api/*', (req, res, next) => {
    console.log("Called /api/*")
    authorize(req, res, next)
});
app.post('/api/course', (req, res) => {
    if("name" in req.query){
        addCourse(req.query.name, res.locals.uid).then(result => {
            if(result == true){
                res.sendStatus(201)
            }else{
                res.sendStatus(409)
            }
        })
    }else{
        res.sendStatus(400)
    }
});
app.get('/api/courses', (req, res) => {
    getCourses().then(courses => {
        res.send(JSON.stringify(courses))
    })
});
app.get('/api/dates', (req, res) => {
    if("course" in req.query){
        getDates(req.query.course).then(dates => res.send(JSON.stringify(dates)))
    }else{
        res.sendStatus(400)
    }
});
app.get('/api/notes', (req, res) => {
    if("course" in req.query && "date" in req.query){
        getNotes(req.query.course, req.query.date).then(notes => res.send(JSON.stringify(notes)))
    }else{
        res.sendStatus(400)
    }
});
app.get('/api/allNotes', (req, res) => {
    if("course" in req.query){
        return getDates(req.query.course).then(dates => {
            let returnNotes = []
            dates.forEach(date => {
                console.log(date)
                getNotes(req.query.course, date).then(notes => {
                    notes.forEach(note => {
                        returnNotes.push(note)
                    })
                })
            })
            res.send(JSON.stringify(returnNotes))
        })
    }else{
        res.sendStatus(400)
    }
});
app.post('/api/star', (req, res) => {
    if("id" in req.query){
        star(req.query.id, res.locals.uid).then(result => {
            if(result == true){
                res.sendStatus(201)
            }else{
                res.sendStatus(409)
            }
        })
    }else{
        res.sendStatus(400)
    }
});
app.post('/api/upload', (req, res, next) => {
    // Hack solution because for some reason authorize doesn't get called when this is called
    authorize(req, res, () => {
        if("course" in req.query && "date" in req.query){
            var fileName = uniqid() + ".pdf"
            fs.writeFileSync(path.join(__dirname, fileName), req.body)
            console.log("UID: " + res.locals.uid)
            addNote(req.query.course, req.query.date, res.locals.uid, fileName).then(result => {
                if(result == true){
                    res.sendStatus(201)
                }else{
                    res.sendStatus(409)
                }
                fs.unlink(fileName)
            })
        }else{
            res.sendStatus(400)
        }
    })
});
app.get('/api/*', (req, res) => {
    // Catch invalid api calls
    res.sendStatus(404)
});
app.all('*', (req, res, next) => {
    res.redirect("index.html")
});

// END ROUTING =================================================