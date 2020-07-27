const express = require('express');//רפרנס למחלקה
const router = express.Router()// מופע של המחלקה
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var worker = require('./Worker');
//const date = require('date-and-time');
//var date1 = require('node-date');
var dateTime = require('node-datetime')
const url = 'mongodb://localhost:27017';
const dbName = 'WorkerDB';
var w = new worker();

//add worker to DB
router.post('/addWorker', function (req, res) {
    var obj = {//construction of JSON paper
        table: []
    };
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        const col = client.db(dbName).collection('Workers');
        req.body.isActive = true;
        col.insertOne(req.body, function (err, result) {
            if (err) {
                res.status(500);
                res.send(' 👎נסה שנית');
            } else {
                res.send('👍 פרטיך נקלטו בהצלחה ');
                emp = req.body;
                fs.readFile('employees.json', 'utf-8', (err, buffer) => {
                    if (err) return console.error('File read error: ', err)
                    var newValue = buffer.slice(0, buffer.length - 1);
                    newValue += ',';
                    newValue += JSON.stringify(emp);
                    newValue += ']';
                    fs.writeFile("employees.json", newValue, err => {
                        if (err) return console.error('File write error:', err);
                        else { console.log("succesully"); }
                    });
                });
            }
        });
    });
});
//get employee details by ID
router.post('/getWorkerByID', function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        const col = client.db(dbName).collection('Workers');
        col.findOne({ WorkerID: req.body.WorkerID }, function (err, result) {
            if (err) {
                res.send('נסה שנית');
            }
            else {
                w = result;
                res.send(result);
            }
        });
    });
});

//delete worker
router.post('/deleteWorkerByID', function (req, res) {

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        const col = client.db(dbName).collection('Workers');
        var newData = { $set: { isActive: false } };
        col.updateOne(req.body, newData, function (err, result) {
            if (err) {
                // console.log(err)
                res.status(500);
                res.send(' 👎נסה שנית');
            } else {
                res.send(req.body.WorkerID + " נמחק מהמערכת");
            }
        });
    });
});
//get number phone and names
router.post('/listOfNamePhone', function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        const col = client.db(dbName).collection('Workers');
        col.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
});
//update worker
router.post('/UpdateWorker', function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        const col = client.db(dbName).collection('Workers');
        var newData = {
            $set: {
                WorkerID: req.body.WorkerID,
                WorkerFName: req.body.WorkerFName,
                WorkerLName: req.body.WorkerLName,
                WorkerAddres: req.body.WorkerAddres,
                WorkerFhone: req.body.WorkerFhone,
                WorkerMail: req.body.WorkerMail
            }
        };
        col.updateOne(w, newData, function (err, result) {
            if (err) {
                res.status(500);
                res.send(' 👎נסה שנית');
            } else {
                res.send(req.body.WorkerID + " עודכן בהצלחה");
            }
        });
    });
});
//add a presence hours
router.post('/addingHour', function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        const col = client.db(dbName).collection('Presence');
        req.body.date = new Date(req.body.date);
        col.insertOne(req.body, function (err, result) {
            if (err) {
                res.send(' 👎נסה שנית');
            } else {
                res.send('נוסף בהצלחה');
                fs.exists(req.body.WorkerIdP, function (exists) {
                    var dt = dateTime.create(req.body.date);
                    var formatted = dt.format('m/d/Y H:M:S');
                    req.body.date = formatted;
                    var str = JSON.stringify(req.body);
                    fs.appendFile(req.body.WorkerIdP, str, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                });

            }
        });
    });
});


//show all the presence of emplyee by pressing ID
router.post('/showPresence', function (req, res) {
    if (fs.existsSync(req.body.WorkerIdP)) {
        var sumHour = fs.readFileSync(req.body.WorkerIdP).toString();
        console.log(sumHour)
        if (sumHour != "") {
            res.send(sumHour);
        }
        else {
            res.send("אין נוכחות , יש למלא שעות ")
        }
    }
    else {
        res.send("אין נוכחות , יש למלא שעות ")
    }
});
module.exports = router;