import sqlite3 from "sqlite3";
const sql3 = sqlite3.verbose();

// Create a new database object, stored in memory
const db = new sql3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('DB created or DB already exists');
  }
});

// Create a new table called "words"
// db.run(`DROP TABLE IF EXISTS Words`, (err) => {
//     if (err) {
//         console.error('Error deleting existing table:', err.message);
//         return;
//     }else{
//         console.error('Table deleted');
//     }
// })

db.run(`
CREATE TABLE IF NOT EXISTS Words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phrase TEXT,
    pronounciation TEXT,
    definition TEXT,
    tags TEXT,
    audioURL TEXT
)
`, (err) => {
if (err) {
    console.error('Error creating table:', err.message);
    return;
} else {
    console.log('Words table created successfully.');
}
});

    
  
//     stmt.finalize((err) => {
//       if (err) {
//         console.error('Error inserting data:', err.message);
//       } else {
//         console.log('Dummy data inserted successfully.');
//       }
//     });

export {db}
