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
db.run(`
CREATE TABLE IF NOT EXISTS Words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phrase TEXT,
    pronunciation TEXT,
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

function insertData() {
    const stmt = db.prepare("INSERT INTO Words (phrase, pronunciation, definition, tags, audioURL) VALUES (?, ?, ?, ?, ?)");
  
    stmt.run(
        '鴨仔聽雷', 
        'Ah-á thiann luî.', 
        'Refers to a duck hearing thunder, not knowing what it is. A metaphor for a person who cannot understand the information they receive.', 
        'slang',
        'https://sutian.moe.edu.tw/zh-hant/su/27204/'
    );
    stmt.run(
        '愛拚才會贏', 
        'Ài piànn tsiah ē iânn.', 
        'Must work hard to win. A metaphor that only through hard work and struggle can one overcome difficulties and achieve success.', 
        'slang',
        'https://sutian.moe.edu.tw/zh-hant/su/27204/'
    );
    stmt.run(
        '愛媠毋驚流鼻水', 
        'Ài-suí m̄ kiann lâu phīnn-tsuí', 
        'To show off a good figure, even in cold weather, one would rather endure the cold than wear more clothes. Often used to tease women who love beauty, willing to pay the price, no matter the cost.', 
        'slang',
        'https://sutian.moe.edu.tw/zh-hant/su/27162/'
    );
    stmt.run(
        '暗頓減食一口，活甲九十九', 
        'Àm-tǹg kiám tsia̍h tsi̍t kháu, ua̍h kah káu-tsa̍p-káu', 
        'Eat one less bite at dinner, live to ninety-nine. Indicates that eating a smaller amount at dinner is beneficial to health.', 
        'slang',
        'https://sutian.moe.edu.tw/zh-hant/su/27164/'
    );
    stmt.run(
        '水啦', 
        'Tsúi-lah', 
        'Means "Awesome!" or "Great!" in English. Used to express approval, admiration, or excitement about something', 
        'slang',
        ''
    );
    
  
//     stmt.finalize((err) => {
//       if (err) {
//         console.error('Error inserting data:', err.message);
//       } else {
//         console.log('Dummy data inserted successfully.');
//       }
//     });
  }

export {db}
