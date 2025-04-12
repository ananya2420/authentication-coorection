// src/app/lib/server/user.js
import db from './db';  // Import the db object correctly

// Function to create a new user
export async function createUser(email, password) {
  const result = db
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, password);
  return result.lastInsertRowid;
}

// Function to get a user by email
export function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}
