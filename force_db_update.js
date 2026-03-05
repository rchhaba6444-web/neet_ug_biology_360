const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'neet.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Check if phone column exists
    db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        const currentColumns = rows.map(row => row.name);

        if (!currentColumns.includes('phone')) {
            console.log("Adding phone column...");
            db.run("ALTER TABLE users ADD COLUMN phone TEXT");
        }
        if (!currentColumns.includes('full_name')) {
            console.log("Adding full_name column...");
            db.run("ALTER TABLE users ADD COLUMN full_name TEXT");
        }
        if (!currentColumns.includes('state')) {
            console.log("Adding state column...");
            db.run("ALTER TABLE users ADD COLUMN state TEXT");
        }

        console.log("Schema update check complete.");
        db.close();
    });
});
