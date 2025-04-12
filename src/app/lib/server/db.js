// src/app/lib/server/db.js
import sql from 'better-sqlite3';
import path from 'path';

// Initialize database
const db = new sql(path.join(process.cwd(), 'training.db'));

// Function to initialize the database (creates tables if needed)
async function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT NOT NULL PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);

  // Check if trainings table has data
  const row = db.prepare('SELECT COUNT(*) as count FROM trainings').get();
  const hasTrainings = row ? row.count > 0 : false;

  if (!hasTrainings) {
    db.exec(`
      INSERT INTO trainings (title, image, description)
      VALUES
      ('Yoga', '/yoga.jpg', 'A gentle way to improve flexibility and balance.'),
      ('Boxing', '/boxing.jpg', 'A high-energy workout that improves strength and speed.'),
      ('Running', '/running.jpg', 'A great way to improve cardiovascular health and endurance.'),
      ('Weightlifting', '/weightlifting.jpg', 'A strength-building workout that helps tone muscles.'),
      ('Cycling', '/cycling.jpg', 'A low-impact workout that improves cardiovascular health and endurance.'),
      ('Gaming', '/gaming.jpg', 'A fun way to improve hand-eye coordination and reflexes.'),
      ('Sailing', '/sailing.jpg', 'A relaxing way to enjoy the outdoors and improve balance.');
    `);
  }
}

// Ensure the database is initialized before running queries
initializeDb();

// Function to fetch training records
export async function getTrainings() {
  return db.prepare("SELECT * FROM trainings").all();
}

// Export the db object and the getTrainings function
export default db;
