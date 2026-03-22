const seedUsers = [
  {
    user_id: 1,
    name: 'Seed Rider',
    email: 'seed.rider@safar.app',
    phone: '01900000001',
    gender: 'Male',
    password: '$2b$10$vY8hzPL/Hab9sOrfzHvX7O4Nh4kaIG7V7F7vXuMBbydW9M7bvY4nW',
    UserType: 'Rider',
  },
  {
    user_id: 2,
    name: 'Seed Driver',
    email: 'seed.driver@safar.app',
    phone: '01900000002',
    gender: 'Male',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 3,
    name: 'Seed Admin',
    email: 'seed.admin@safar.app',
    phone: '01900000003',
    gender: 'Other',
    password: '$2b$10$Mgpi9YVVHkB3rly.A8MBiODFMN3LvROAISUxAxAHmk8H2.zuxVpY.',
    UserType: 'Admin',
  },
  {
    user_id: 4,
    name: 'Seed Rider 2',
    email: 'seed.rider2@safar.app',
    phone: '01900000004',
    gender: 'Female',
    password: '$2b$10$vY8hzPL/Hab9sOrfzHvX7O4Nh4kaIG7V7F7vXuMBbydW9M7bvY4nW',
    UserType: 'Rider',
  },
  {
    user_id: 5,
    name: 'Seed Driver 2',
    email: 'seed.driver2@safar.app',
    phone: '01900000005',
    gender: 'Male',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 6,
    name: 'Seed Admin 2',
    email: 'seed.admin2@safar.app',
    phone: '01900000006',
    gender: 'Male',
    password: '$2b$10$Mgpi9YVVHkB3rly.A8MBiODFMN3LvROAISUxAxAHmk8H2.zuxVpY.',
    UserType: 'Admin',
  },
  {
    user_id: 7,
    name: 'Rafiq Hasan',
    email: 'rafiq.driver@safar.app',
    phone: '01900000007',
    gender: 'Male',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 8,
    name: 'Sharmin Akter',
    email: 'sharmin.driver@safar.app',
    phone: '01900000008',
    gender: 'Female',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 9,
    name: 'Mizanur Rahman',
    email: 'mizan.driver@safar.app',
    phone: '01900000009',
    gender: 'Male',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 10,
    name: 'Nusrat Jahan',
    email: 'nusrat.driver@safar.app',
    phone: '01900000010',
    gender: 'Female',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 11,
    name: 'Tanvir Ahmed',
    email: 'tanvir.driver@safar.app',
    phone: '01900000011',
    gender: 'Male',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
  {
    user_id: 12,
    name: 'Sadia Islam',
    email: 'sadia.driver@safar.app',
    phone: '01900000012',
    gender: 'Female',
    password: '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.',
    UserType: 'Driver',
  },
];

async function createSchema(db) {
  await db.exec('PRAGMA foreign_keys = ON;');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT UNIQUE NOT NULL,
      gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
      password TEXT NOT NULL,
      UserType TEXT CHECK (UserType IN ('Admin', 'Rider', 'Driver'))
    );

    CREATE TABLE IF NOT EXISTS vehicle (
      vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_type TEXT CHECK (vehicle_type IN ('Car', 'Bike', 'SUV')),
      model TEXT,
      capacity INTEGER,
      driver_id INTEGER NOT NULL,
      FOREIGN KEY (driver_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS ride (
      ride_id INTEGER PRIMARY KEY AUTOINCREMENT,
      pickup_location TEXT,
      dropoff_location TEXT,
      fare REAL,
      driver_id INTEGER NOT NULL,
      rider_id INTEGER NOT NULL,
      start_time TEXT,
      end_time TEXT,
      FOREIGN KEY (driver_id) REFERENCES users(user_id),
      FOREIGN KEY (rider_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS rides (
      ride_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      start_lat REAL,
      start_lng REAL,
      dest_lat REAL,
      dest_lng REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)
    );

    CREATE TABLE IF NOT EXISTS payment (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL,
      payment_method TEXT CHECK (payment_method IN ('Credit Card', 'Debit Card', 'Cash')),
      payment_status TEXT CHECK (payment_status IN ('Pending', 'Completed', 'Failed')),
      ride_id INTEGER NOT NULL,
      FOREIGN KEY (ride_id) REFERENCES ride(ride_id)
    );

    CREATE TABLE IF NOT EXISTS tracking (
      tracking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      ride_id INTEGER NOT NULL,
      current_location TEXT,
      estimated_time_of_arrival TEXT,
      status TEXT CHECK (status IN ('On-going', 'Completed', 'Cancelled')),
      traffic_conditions TEXT,
      FOREIGN KEY (ride_id) REFERENCES ride(ride_id)
    );

    CREATE TABLE IF NOT EXISTS loyalty_program (
      program_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      points INTEGER,
      tier TEXT CHECK (tier IN ('Silver', 'Gold', 'Platinum')),
      combo_offers TEXT,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS pre_booking (
      booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      pickup_location TEXT,
      dropoff_location TEXT,
      fare REAL,
      driver_id INTEGER NOT NULL,
      rider_id INTEGER NOT NULL,
      start_time TEXT,
      end_time TEXT,
      FOREIGN KEY (driver_id) REFERENCES users(user_id),
      FOREIGN KEY (rider_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS sos_alert (
      alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      emergency_contact TEXT,
      location TEXT,
      ride_id INTEGER NOT NULL,
      timestamp TEXT,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (ride_id) REFERENCES ride(ride_id)
    );
  `);

  const rideColumns = await db.all(`PRAGMA table_info(ride)`);
  const existingRideColumns = new Set(rideColumns.map((column) => column.name));

  if (!existingRideColumns.has('pickup_lat')) {
    await db.exec(`ALTER TABLE ride ADD COLUMN pickup_lat REAL`);
  }
  if (!existingRideColumns.has('pickup_lng')) {
    await db.exec(`ALTER TABLE ride ADD COLUMN pickup_lng REAL`);
  }
  if (!existingRideColumns.has('dropoff_lat')) {
    await db.exec(`ALTER TABLE ride ADD COLUMN dropoff_lat REAL`);
  }
  if (!existingRideColumns.has('dropoff_lng')) {
    await db.exec(`ALTER TABLE ride ADD COLUMN dropoff_lng REAL`);
  }
  if (!existingRideColumns.has('status')) {
    await db.exec(`ALTER TABLE ride ADD COLUMN status TEXT DEFAULT 'Completed'`);
  }
  if (!existingRideColumns.has('requested_at')) {
    await db.exec(`ALTER TABLE ride ADD COLUMN requested_at TEXT`);
  }

  await db.exec(`UPDATE ride SET status = COALESCE(status, 'Completed')`);
  await db.exec(`UPDATE ride SET requested_at = COALESCE(requested_at, start_time, CURRENT_TIMESTAMP)`);
}

async function seedData(db) {
  for (const user of seedUsers) {
    await db.run(
      `INSERT OR IGNORE INTO users (user_id, name, email, phone, gender, password, UserType)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.user_id,
        user.name,
        user.email,
        user.phone,
        user.gender,
        user.password,
        user.UserType,
      ]
    );
  }

  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [1, 'Car', 'Toyota Axio', 4, 2]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [2, 'Bike', 'Yamaha FZS', 2, 2]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [3, 'SUV', 'Toyota Noah', 6, 5]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [4, 'Car', 'Honda City', 4, 7]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [5, 'Bike', 'Honda Hornet', 1, 8]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [6, 'SUV', 'Mitsubishi Outlander', 7, 9]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [7, 'Car', 'Nissan Sunny', 4, 10]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [8, 'Bike', 'Suzuki Gixxer', 1, 11]);
  await db.run(`INSERT OR IGNORE INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES (?, ?, ?, ?, ?)`, [9, 'SUV', 'Toyota Land Cruiser Prado', 7, 12]);

  await db.run(
    `INSERT OR IGNORE INTO ride (ride_id, pickup_location, dropoff_location, fare, driver_id, rider_id, start_time, end_time)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+35 minutes'))`,
    [1, 'Dhanmondi 27', 'Uttara Sector 7', 420.0, 2, 1]
  );

  await db.run(
    `INSERT OR IGNORE INTO ride (ride_id, pickup_location, dropoff_location, fare, driver_id, rider_id, start_time, end_time)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 day'), datetime('now', '-23 hours', '-20 minutes'))`,
    [2, 'Mirpur DOHS', 'Banani 11', 360.0, 5, 4]
  );

  await db.run(`INSERT OR IGNORE INTO payment (payment_id, amount, payment_method, payment_status, ride_id) VALUES (?, ?, ?, ?, ?)`, [1, 420.0, 'Cash', 'Completed', 1]);
  await db.run(`INSERT OR IGNORE INTO payment (payment_id, amount, payment_method, payment_status, ride_id) VALUES (?, ?, ?, ?, ?)`, [2, 360.0, 'Credit Card', 'Completed', 2]);

  await db.run(
    `INSERT OR IGNORE INTO tracking (tracking_id, ride_id, current_location, estimated_time_of_arrival, status, traffic_conditions)
     VALUES (?, ?, ?, datetime('now', '+20 minutes'), ?, ?)`,
    [1, 1, 'Farmgate', 'On-going', 'Moderate']
  );

  await db.run(
    `INSERT OR IGNORE INTO tracking (tracking_id, ride_id, current_location, estimated_time_of_arrival, status, traffic_conditions)
     VALUES (?, ?, ?, datetime('now', '-20 hours'), ?, ?)`,
    [2, 2, 'Banani Flyover', 'Completed', 'Light']
  );

  await db.run(`INSERT OR IGNORE INTO loyalty_program (program_id, user_id, points, tier, combo_offers) VALUES (?, ?, ?, ?, ?)`, [1, 1, 120, 'Silver', 'Ride+Parcel 10% Off']);
  await db.run(`INSERT OR IGNORE INTO loyalty_program (program_id, user_id, points, tier, combo_offers) VALUES (?, ?, ?, ?, ?)`, [2, 4, 280, 'Gold', 'Monthly commuter bundle']);

  await db.run(
    `INSERT OR IGNORE INTO pre_booking (booking_id, pickup_location, dropoff_location, fare, driver_id, rider_id, start_time, end_time)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+1 day'), datetime('now', '+1 day', '+30 minutes'))`,
    [1, 'Bashundhara R/A', 'Airport', 280.0, 2, 1]
  );

  await db.run(
    `INSERT OR IGNORE INTO pre_booking (booking_id, pickup_location, dropoff_location, fare, driver_id, rider_id, start_time, end_time)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+2 day'), datetime('now', '+2 day', '+45 minutes'))`,
    [2, 'Mohakhali', 'Purbachal', 390.0, 5, 4]
  );

  await db.run(
    `INSERT OR IGNORE INTO sos_alert (alert_id, user_id, emergency_contact, location, ride_id, timestamp)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [1, 1, '01700011223', 'Tejgaon Link Road', 1]
  );

  await db.run(
    `INSERT OR IGNORE INTO sos_alert (alert_id, user_id, emergency_contact, location, ride_id, timestamp)
     VALUES (?, ?, ?, ?, ?, datetime('now', '-22 hours'))`,
    [2, 4, '01800044556', 'Banani Flyover', 2]
  );
}

async function initializeSqlite(db) {
  await createSchema(db);
  await seedData(db);
}

module.exports = {
  initializeSqlite,
};
