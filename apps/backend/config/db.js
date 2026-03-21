const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

const { initializeSqlite } = require('../database/sqlite-bootstrap');

const dbFilePath = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.join(__dirname, '..', 'database', 'safar.sqlite');

let dbInstancePromise;

async function getDbInstance() {
  if (!dbInstancePromise) {
    dbInstancePromise = (async () => {
      const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
      });

      await initializeSqlite(db);
      return db;
    })();
  }

  return dbInstancePromise;
}

function normalizeDatabaseError(error) {
  if (error && error.code === 'SQLITE_CONSTRAINT') {
    error.code = 'ER_DUP_ENTRY';
  }
  return error;
}

async function query(sql, params = []) {
  const db = await getDbInstance();

  try {
    const normalizedSql = sql.trim().toUpperCase();

    if (normalizedSql.startsWith('SELECT') || normalizedSql.startsWith('PRAGMA') || normalizedSql.startsWith('WITH')) {
      const rows = await db.all(sql, params);
      return [rows, []];
    }

    const result = await db.run(sql, params);
    return [
      {
        insertId: result.lastID,
        affectedRows: result.changes,
      },
      [],
    ];
  } catch (error) {
    throw normalizeDatabaseError(error);
  }
}

async function execute(sql, params = []) {
  return query(sql, params);
}

async function getConnection() {
  await getDbInstance();

  return {
    query,
    execute,
    release: () => {},
  };
}

module.exports = {
  query,
  execute,
  getConnection,
  getDbInstance,
  dbFilePath,
};