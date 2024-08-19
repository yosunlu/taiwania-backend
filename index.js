import {db} from "./database.js"
import express from "express";
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200);
    res.send("Connected");

})

app.get("/api", (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM Words';
    let data = {phrases: []};
    try{
        db.all(sql, [], (err, rows) => {
            if(err) {
                throw err;
            }
            rows.forEach(row => {
                data.phrases.push({id: row.id, phrase: row.phrase, pronunciation: row.pronunciation, definition: row.definition, tags: row.tags, audioURL: row.audioURL})
            })
            let content = JSON.stringify(data);
            res.send(content);
        })
    }catch(err){
        console.log(err.message);
        res.status(467);
        res.send(`{"code":467}, "status:" "${err.message}"`)
    }
});

app.post("/api", (req,res) => {
    res.set('contente-type', 'application/json');
    const sql = 'INSERT INTO Words(phrase, pronunciation, definition, tags, audioURL) VALUES(?, ?, ?, ?, ?)';
    let newID;
    try{
        db.run(sql, [req.body.phrase, req.body.pronunciation, req.body.definition, req.body.tags, req.body.audioURL], function(err){
            if(err) throw err;
        })
        // newID = this.lastID; 
        res.status(201); // represents new record created
        let data = {status: 201, message:`record created`};
        let content = JSON.stringify(data);
        res.send(content);
    }catch(err){
        console.log(err.message);
        res.status(468);
        res.send(`{"code":468}, "status:" "${err.message}"`)
    }
});

app.delete("/api", (req,res) => {});

app.listen(4000, (err) => {
    if(err) {
        console.log("error", err.message)
    }
    console.log("Listening on port 4000")
})
