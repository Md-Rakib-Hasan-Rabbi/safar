const db = require('../apps/backend/config/db');

async function main() {
  const [roleCounts] = await db.execute(
    `SELECT UserType, COUNT(*) AS total
     FROM users
     GROUP BY UserType
     ORDER BY UserType`
  );

  const [drivers] = await db.execute(
    `SELECT u.user_id, u.name, u.email, u.phone, u.gender,
            v.vehicle_type, v.model, v.capacity
     FROM users u
     LEFT JOIN vehicle v ON u.user_id = v.driver_id
     WHERE u.UserType = 'Driver'
     ORDER BY u.user_id, v.vehicle_type`
  );

  const [vehicles] = await db.execute(
    `SELECT vehicle_id, vehicle_type, model, capacity, driver_id
     FROM vehicle
     ORDER BY vehicle_id`
  );

  console.log('\n=== ROLE COUNTS ===');
  console.table(roleCounts);

  console.log('\n=== DRIVERS WITH VEHICLES ===');
  console.table(drivers);

  console.log('\n=== ALL VEHICLES ===');
  console.table(vehicles);
}

main().catch((error) => {
  console.error('view-seed-data-failed:', error.message);
  process.exit(1);
});
