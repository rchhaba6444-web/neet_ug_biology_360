// Clear all user sessions on startup
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, 'neet.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database for session cleanup');
  }
});

// Clear all user sessions
db.run('DELETE FROM user_sessions', (err) => {
  if (err) {
    console.error('Error clearing user sessions:', err.message);
  } else {
    console.log('All user sessions cleared on server startup');
  }
});

// Clear any expired tokens or old data
db.run('DELETE FROM user_activity WHERE created_at < datetime("now", "-7 days")', (err) => {
  if (err) {
    console.error('Error clearing old activity logs:', err.message);
  } else {
    console.log('Old activity logs cleared');
  }
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed after cleanup');
  }
});
