-- Safar import script for MySQL Workbench
-- Creates schema + tables + seed data
-- Generated for direct import in Workbench

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS safar;
CREATE DATABASE safar CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE safar;

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('Male','Female','Other') DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  UserType ENUM('Admin','Rider','Driver') DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_phone (phone),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ride (
  ride_id INT NOT NULL AUTO_INCREMENT,
  pickup_location VARCHAR(255) DEFAULT NULL,
  dropoff_location VARCHAR(255) DEFAULT NULL,
  fare DECIMAL(10,2) DEFAULT NULL,
  driver_id INT NOT NULL,
  rider_id INT NOT NULL,
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  PRIMARY KEY (ride_id),
  KEY idx_ride_driver_id (driver_id),
  KEY idx_ride_rider_id (rider_id),
  CONSTRAINT fk_ride_driver FOREIGN KEY (driver_id) REFERENCES users (user_id),
  CONSTRAINT fk_ride_rider FOREIGN KEY (rider_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE payment (
  payment_id INT NOT NULL AUTO_INCREMENT,
  amount DECIMAL(10,2) DEFAULT NULL,
  payment_method ENUM('Credit Card','Debit Card','Cash') DEFAULT NULL,
  payment_status ENUM('Pending','Completed','Failed') DEFAULT NULL,
  ride_id INT NOT NULL,
  PRIMARY KEY (payment_id),
  KEY idx_payment_ride_id (ride_id),
  CONSTRAINT fk_payment_ride FOREIGN KEY (ride_id) REFERENCES ride (ride_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tracking (
  tracking_id INT NOT NULL AUTO_INCREMENT,
  ride_id INT NOT NULL,
  current_location VARCHAR(255) DEFAULT NULL,
  estimated_time_of_arrival DATETIME DEFAULT NULL,
  status ENUM('On-going','Completed','Cancelled') DEFAULT NULL,
  traffic_conditions VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (tracking_id),
  KEY idx_tracking_ride_id (ride_id),
  CONSTRAINT fk_tracking_ride FOREIGN KEY (ride_id) REFERENCES ride (ride_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE loyalty_program (
  program_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  points INT DEFAULT NULL,
  tier ENUM('Silver','Gold','Platinum') DEFAULT NULL,
  combo_offers VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (program_id),
  KEY idx_loyalty_user_id (user_id),
  CONSTRAINT fk_loyalty_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE pre_booking (
  booking_id INT NOT NULL AUTO_INCREMENT,
  pickup_location VARCHAR(255) DEFAULT NULL,
  dropoff_location VARCHAR(255) DEFAULT NULL,
  fare DECIMAL(10,2) DEFAULT NULL,
  driver_id INT NOT NULL,
  rider_id INT NOT NULL,
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  PRIMARY KEY (booking_id),
  KEY idx_pre_booking_driver_id (driver_id),
  KEY idx_pre_booking_rider_id (rider_id),
  CONSTRAINT fk_pre_booking_driver FOREIGN KEY (driver_id) REFERENCES users (user_id),
  CONSTRAINT fk_pre_booking_rider FOREIGN KEY (rider_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE sos_alert (
  alert_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  emergency_contact VARCHAR(255) DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  ride_id INT NOT NULL,
  timestamp DATETIME DEFAULT NULL,
  PRIMARY KEY (alert_id),
  KEY idx_sos_user_id (user_id),
  KEY idx_sos_ride_id (ride_id),
  CONSTRAINT fk_sos_user FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT fk_sos_ride FOREIGN KEY (ride_id) REFERENCES ride (ride_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE vehicle (
  vehicle_id INT NOT NULL AUTO_INCREMENT,
  vehicle_type ENUM('Car','Bike','SUV') DEFAULT NULL,
  model VARCHAR(255) DEFAULT NULL,
  capacity INT DEFAULT NULL,
  driver_id INT NOT NULL,
  PRIMARY KEY (vehicle_id),
  KEY idx_vehicle_driver_id (driver_id),
  CONSTRAINT fk_vehicle_driver FOREIGN KEY (driver_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Seed users (default login credentials)
-- Rider  -> any seed rider email / rider123
-- Driver -> any seed driver email / driver123
-- Admin  -> any seed admin email / admin123
INSERT INTO users (user_id, name, email, phone, gender, password, UserType) VALUES
(1, 'Seed Rider',  'seed.rider@safar.app',  '01900000001', 'Male',  '$2b$10$vY8hzPL/Hab9sOrfzHvX7O4Nh4kaIG7V7F7vXuMBbydW9M7bvY4nW', 'Rider'),
(4, 'Seed Rider 2',  'seed.rider2@safar.app',  '01900000004', 'Female',  '$2b$10$vY8hzPL/Hab9sOrfzHvX7O4Nh4kaIG7V7F7vXuMBbydW9M7bvY4nW', 'Rider'),
(2, 'Seed Driver', 'seed.driver@safar.app', '01900000002', 'Male',  '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.', 'Driver'),
(5, 'Seed Driver 2', 'seed.driver2@safar.app', '01900000005', 'Male',  '$2b$10$/wdUFU/wOIk9TaYc9uO4LOuZLhDxNuHN.DQF3TiKVSUA3ZzsjeiP.', 'Driver'),
(3, 'Seed Admin',  'seed.admin@safar.app',  '01900000003', 'Other', '$2b$10$Mgpi9YVVHkB3rly.A8MBiODFMN3LvROAISUxAxAHmk8H2.zuxVpY.', 'Admin'),
(6, 'Seed Admin 2',  'seed.admin2@safar.app',  '01900000006', 'Male', '$2b$10$Mgpi9YVVHkB3rly.A8MBiODFMN3LvROAISUxAxAHmk8H2.zuxVpY.', 'Admin');

INSERT INTO vehicle (vehicle_id, vehicle_type, model, capacity, driver_id) VALUES
(1, 'Car', 'Toyota Axio', 4, 2),
(2, 'Bike', 'Yamaha FZS', 2, 2),
(3, 'SUV', 'Toyota Noah', 6, 5);

INSERT INTO ride (ride_id, pickup_location, dropoff_location, fare, driver_id, rider_id, start_time, end_time) VALUES
(1, 'Dhanmondi 27', 'Uttara Sector 7', 420.00, 2, 1, NOW(), DATE_ADD(NOW(), INTERVAL 35 MINUTE)),
(2, 'Mirpur DOHS', 'Banani 11', 360.00, 5, 4, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(DATE_ADD(NOW(), INTERVAL 40 MINUTE), INTERVAL 1 DAY));

INSERT INTO payment (payment_id, amount, payment_method, payment_status, ride_id) VALUES
(1, 420.00, 'Cash', 'Completed', 1),
(2, 360.00, 'Credit Card', 'Completed', 2);

INSERT INTO tracking (tracking_id, ride_id, current_location, estimated_time_of_arrival, status, traffic_conditions) VALUES
(1, 1, 'Farmgate', DATE_ADD(NOW(), INTERVAL 20 MINUTE), 'On-going', 'Moderate'),
(2, 2, 'Banani Flyover', DATE_SUB(NOW(), INTERVAL 20 HOUR), 'Completed', 'Light');

INSERT INTO loyalty_program (program_id, user_id, points, tier, combo_offers) VALUES
(1, 1, 120, 'Silver', 'Ride+Parcel 10% Off'),
(2, 4, 280, 'Gold', 'Monthly commuter bundle');

INSERT INTO pre_booking (booking_id, pickup_location, dropoff_location, fare, driver_id, rider_id, start_time, end_time) VALUES
(1, 'Bashundhara R/A', 'Airport', 280.00, 2, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 30 MINUTE)),
(2, 'Mohakhali', 'Purbachal', 390.00, 5, 4, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 45 MINUTE));

INSERT INTO sos_alert (alert_id, user_id, emergency_contact, location, ride_id, timestamp) VALUES
(1, 1, '01700011223', 'Tejgaon Link Road', 1, NOW()),
(2, 4, '01800044556', 'Banani Flyover', 2, DATE_SUB(NOW(), INTERVAL 22 HOUR));

SET FOREIGN_KEY_CHECKS = 1;
