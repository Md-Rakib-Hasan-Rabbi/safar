const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const { initializeSqlite } = require('../apps/backend/database/sqlite-bootstrap');

async function main() {
  const dbFilePath = process.env.DB_FILE
    ? path.resolve(process.env.DB_FILE)
    : path.join(process.cwd(), 'apps', 'backend', 'database', 'safar.sqlite');

  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
  }

  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  await initializeSqlite(db);

  const roleCounts = await db.all(
    'SELECT UserType, COUNT(*) AS total FROM users GROUP BY UserType ORDER BY UserType'
  );

  console.log('db-update-success');
  console.log('sqlite-file:', dbFilePath);
  console.log('role-counts:', roleCounts);

  await db.close();
}

main().catch((error) => {
  console.error('db-update-failed:', error.message);
  process.exit(1);
});
