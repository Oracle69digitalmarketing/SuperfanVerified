import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT, age INTEGER);"
    );
  });
};

export const insertUser = (name: string, age: number) => {
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO users (name, age) VALUES (?, ?);",
      [name, age]
    );
  });
};

export const getUsers = (callback: (users: any[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM users;",
      [],
      (_, { rows }) => callback(rows._array)
    );
  });
};
