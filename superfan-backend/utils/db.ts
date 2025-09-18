import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

// Utility to run transactions
export const runTransaction = (callback: (tx: SQLite.SQLTransaction) => void) => {
  db.transaction(callback);
};

// Create tables
export const createTables = () => {
  runTransaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        wallet_address TEXT,
        chain_id INTEGER
      );`,
      [],
      () => console.log('✅ Users table created'),
      (_, error) => {
        console.error('❌ Error creating users table:', error);
        return false;
      }
    );
  });
};

// Insert a user
export const insertUser = (
  name: string,
  age: number,
  wallet_address: string = '',
  chain_id: number = 0
) => {
  runTransaction(tx => {
    tx.executeSql(
      `INSERT INTO users (name, age, wallet_address, chain_id) VALUES (?, ?, ?, ?);`,
      [name, age, wallet_address, chain_id],
      () => console.log(`✅ Inserted user: ${name}`),
      (_, error) => {
        console.error('❌ Error inserting user:', error);
        return false;
      }
    );
  });
};

// Get all users
export const getUsers = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    runTransaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          console.error('❌ Error fetching users:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Delete a user by ID
export const deleteUser = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    runTransaction(tx => {
      tx.executeSql(
        'DELETE FROM users WHERE id = ?;',
        [id],
        () => {
          console.log(`🗑️ Deleted user with ID: ${id}`);
          resolve();
        },
        (_, error) => {
          console.error('❌ Error deleting user:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Update a user's name and age
export const updateUser = (
  id: number,
  name: string,
  age: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    runTransaction(tx => {
      tx.executeSql(
        'UPDATE users SET name = ?, age = ? WHERE id = ?;',
        [name, age, id],
        () => {
          console.log(`✏️ Updated user with ID: ${id}`);
          resolve();
        },
        (_, error) => {
          console.error('❌ Error updating user:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};
