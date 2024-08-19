import { db } from "./database.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Basic Route for Testing Connection
app.get('/', (req, res) => {
    res.status(200).send("Connected");
});

// GET API to Fetch All Records
app.get("/api", (req, res) => {
    res.set('Content-Type', 'application/json'); 
    const sql = 'SELECT * FROM Words';
    let data = { phrases: [] };

    try {
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach(row => {
                data.phrases.push({
                    id: row.id,
                    phrase: row.phrase,
                    pronounciation: row.pronounciation,
                    definition: row.definition,
                    tags: row.tags,
                    audioURL: row.audioURL
                });
            });
            res.status(200).json(data);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ code: 500, status: err.message });
    }
});

// POST API to Insert a New Record
app.post("/api", (req, res) => {
    res.set('Content-Type', 'application/json'); 
    const sql = 'INSERT INTO Words(phrase, pronounciation, definition, tags, audioURL) VALUES(?, ?, ?, ?, ?)';

    try {
        db.run(sql, [req.body.phrase, req.body.pronounciation, req.body.definition, req.body.tags, req.body.audioURL], function (err) {
            if (err) {
                throw err;
            }
            const newID = this.lastID; 
            res.status(201).json({ status: 201, message: `Record created with ID ${newID}` });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ code: 500, status: err.message });
    }
});

// batch input
app.post("/api/batch", (req, res) => {
    res.set('Content-Type', 'application/json'); 
    
    const sql = 'INSERT INTO Words(phrase, pronounciation, definition, tags, audioURL) VALUES(?, ?, ?, ?, ?)';
    const wordsArray = req.body;

    if (!Array.isArray(wordsArray) || wordsArray.length === 0) {
        return res.status(400).json({ status: 400, message: 'Invalid input, expected an array of words' });
    }

    const placeholders = wordsArray.map(() => '(?, ?, ?, ?, ?)').join(',');
    const flattenedValues = wordsArray.reduce((acc, word) => {
        return acc.concat([word.phrase, word.pronounciation, word.definition, word.tags, word.audioURL]);
    }, []);

    try {
        db.run(`INSERT INTO Words(phrase, pronounciation, definition, tags, audioURL) VALUES ${placeholders}`, flattenedValues, function (err) {
            if (err) {
                throw err;
            }
            res.status(201).json({ status: 201, message: `Batch insert successful, inserted ${this.changes} records.` });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 500, message: err.message });
    }
});

// DELETE API to Remove a Record by ID
app.delete("/api/:id", (req, res) => {
    const sql = 'DELETE FROM Words WHERE id = ?';

    try {
        db.run(sql, req.params.id, function (err) {
            if (err) {
                throw err;
            }
            if (this.changes === 0) {
                res.status(404).json({ status: 404, message: "Record not found" });
            } else {
                res.status(200).json({ status: 200, message: `Record with ID ${req.params.id} deleted` });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ code: 500, status: err.message });
    }
});

// Start the Server
app.listen(4000, (err) => {
    if (err) {
        console.error("Error:", err.message);
    } else {
        console.log("Listening on port 4000");
    }
});
