const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'neet.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database for migration');
  }
});

// Function to check if a column exists in a table
function columnExists(tableName, columnName, callback) {
  db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
    if (err) {
      callback(false);
      return;
    }
    
    const columnExists = columns.some(col => col.name === columnName);
    callback(columnExists);
  });
}

// Migration function
function migrateMCQTable() {
  console.log('Checking MCQ table structure...');
  
  // Check if correct_answer column exists
  columnExists('mcqs', 'correct_answer', (exists) => {
    if (exists) {
      console.log('Column correct_answer already exists. Checking for correct_index...');
      
      // Check if correct_index column exists (old column name)
      columnExists('mcqs', 'correct_index', (oldExists) => {
        if (oldExists) {
          console.log('Old column correct_index found. Renaming to correct_answer...');
          
          // Rename the column by recreating the table
          db.serialize(() => {
            // Create temporary table with new structure
            db.run('CREATE TABLE mcqs_temp AS SELECT ' +
              'id, chapter_id, question, options, ' +
              'correct_index AS correct_answer, ' +
              'category, solution, image_url, difficulty, created_at ' +
              'FROM mcqs;');
            
            // Drop old table
            db.run('DROP TABLE mcqs;');
            
            // Recreate table with correct structure
            db.run(`CREATE TABLE mcqs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              chapter_id INTEGER NOT NULL,
              question TEXT NOT NULL,
              options TEXT NOT NULL,
              correct_answer INTEGER NOT NULL,
              category TEXT NOT NULL,
              solution TEXT,
              image_url TEXT,
              difficulty TEXT DEFAULT 'medium',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            // Copy data from temp table
            db.run('INSERT INTO mcqs SELECT * FROM mcqs_temp;');
            
            // Drop temp table
            db.run('DROP TABLE mcqs_temp;');
            
            console.log('MCQ table migrated successfully!');
          });
        } else {
          console.log('MCQ table already has correct structure.');
        }
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed.');
          }
        });
      });
    } else {
      console.log('Column correct_answer does not exist. Creating new table...');
      
      // Backup the existing table
      db.run('ALTER TABLE mcqs RENAME TO mcqs_backup;', (err) => {
        if (err) {
          console.log('No existing mcqs table to backup, creating fresh table...');
        }
        
        // Create new table with correct structure
        db.run(`CREATE TABLE mcqs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chapter_id INTEGER NOT NULL,
          question TEXT NOT NULL,
          options TEXT NOT NULL,
          correct_answer INTEGER NOT NULL,
          category TEXT NOT NULL,
          solution TEXT,
          image_url TEXT,
          difficulty TEXT DEFAULT 'medium',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Error creating new mcqs table:', err);
          } else {
            console.log('New MCQ table created successfully!');
            
            // If there was a backup, try to copy data
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='mcqs_backup'", (err, row) => {
              if (row) {
                // Try to copy data from backup (assuming correct_index column exists)
                db.run(`INSERT INTO mcqs (id, chapter_id, question, options, correct_answer, category, solution, image_url, difficulty, created_at)
                        SELECT id, chapter_id, question, options, correct_index, category, solution, image_url, difficulty, created_at
                        FROM mcqs_backup;`, (err) => {
                  if (err) {
                    console.log('Could not copy data from backup (different structure)');
                  } else {
                    console.log('Data copied from backup table');
                  }
                  
                  // Drop the backup
                  db.run('DROP TABLE mcqs_backup;');
                });
              }
            });
          }
          
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('Database connection closed.');
            }
          });
        });
      });
    }
  });
}

// Run the migration
migrateMCQTable();