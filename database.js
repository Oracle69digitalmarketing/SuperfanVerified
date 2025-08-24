// database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('fanbase.db');

export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        points INTEGER DEFAULT 0,
        rank INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS fan_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action_type TEXT,
        points_awarded INTEGER,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS referral_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_id INTEGER,
        referred_user_id INTEGER,
        reward_type TEXT,
        reward_status TEXT DEFAULT 'pending',
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });
};

export default db;
