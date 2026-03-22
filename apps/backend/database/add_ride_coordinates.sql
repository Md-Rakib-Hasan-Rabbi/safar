-- Add latitude and longitude columns to ride table
ALTER TABLE ride ADD COLUMN pickup_lat DECIMAL(10, 8) DEFAULT NULL;
ALTER TABLE ride ADD COLUMN pickup_lng DECIMAL(11, 8) DEFAULT NULL;
ALTER TABLE ride ADD COLUMN dropoff_lat DECIMAL(10, 8) DEFAULT NULL;
ALTER TABLE ride ADD COLUMN dropoff_lng DECIMAL(11, 8) DEFAULT NULL;
ALTER TABLE ride ADD COLUMN vehicle_id INT;
ALTER TABLE ride ADD COLUMN status ENUM('Requested', 'Accepted', 'In Transit', 'Completed', 'Cancelled') DEFAULT 'Requested';
ALTER TABLE ride ADD FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id);

-- Also update women_only_ride table for consistency
ALTER TABLE women_only_ride ADD COLUMN pickup_lat DECIMAL(10, 8) DEFAULT NULL;
ALTER TABLE women_only_ride ADD COLUMN pickup_lng DECIMAL(11, 8) DEFAULT NULL;
ALTER TABLE women_only_ride ADD COLUMN dropoff_lat DECIMAL(10, 8) DEFAULT NULL;
ALTER TABLE women_only_ride ADD COLUMN dropoff_lng DECIMAL(11, 8) DEFAULT NULL;
ALTER TABLE women_only_ride ADD COLUMN status ENUM('Requested', 'Accepted', 'In Transit', 'Completed', 'Cancelled') DEFAULT 'Requested';
