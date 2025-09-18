import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('fanbase.db');

export const setupDatabase = () => {
  db.transaction(tx => {
    // 👤 Users Table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        points INTEGER DEFAULT 0,
        rank INTEGER DEFAULT 0,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 🎯 Fan Activity Table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS fan_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action_type TEXT NOT NULL,
        points_awarded INTEGER DEFAULT 0,
        synced INTEGER DEFAULT 0,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    // 🎁 Referral Rewards Table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS referral_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_id INTEGER NOT NULL,
        referred_user_id INTEGER NOT NULL,
        reward_type TEXT NOT NULL,
        reward_status TEXT DEFAULT 'pending',
        synced INTEGER DEFAULT 0,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(referrer_id) REFERENCES users(id),
        FOREIGN KEY(referred_user_id) REFERENCES users(id)
      );
    `);

    // 🔁 Sync Queue Table (for offline sync retries)
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        endpoint TEXT NOT NULL,
        payload TEXT NOT NULL,
        retries INTEGER DEFAULT 0,
        lastAttempt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });
};

export default db;
