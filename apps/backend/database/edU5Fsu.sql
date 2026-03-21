-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: safar
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `loyalty_program`
--

DROP TABLE IF EXISTS `loyalty_program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_program` (
  `program_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `points` int DEFAULT NULL,
  `tier` enum('Silver','Gold','Platinum') DEFAULT NULL,
  `combo_offers` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`program_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `loyalty_program_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_program`
--

LOCK TABLES `loyalty_program` WRITE;
/*!40000 ALTER TABLE `loyalty_program` DISABLE KEYS */;
/*!40000 ALTER TABLE `loyalty_program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('Credit Card','Debit Card','Cash') DEFAULT NULL,
  `payment_status` enum('Pending','Completed','Failed') DEFAULT NULL,
  `ride_id` int NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `ride_id` (`ride_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `ride` (`ride_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pre_booking`
--

DROP TABLE IF EXISTS `pre_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pre_booking` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `pickup_location` varchar(255) DEFAULT NULL,
  `dropoff_location` varchar(255) DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  `driver_id` int NOT NULL,
  `rider_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `driver_id` (`driver_id`),
  KEY `rider_id` (`rider_id`),
  CONSTRAINT `pre_booking_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `pre_booking_ibfk_2` FOREIGN KEY (`rider_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pre_booking`
--

LOCK TABLES `pre_booking` WRITE;
/*!40000 ALTER TABLE `pre_booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `pre_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ride`
--

DROP TABLE IF EXISTS `ride`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ride` (
  `ride_id` int NOT NULL AUTO_INCREMENT,
  `pickup_location` varchar(255) DEFAULT NULL,
  `dropoff_location` varchar(255) DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  `driver_id` int NOT NULL,
  `rider_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`ride_id`),
  KEY `driver_id` (`driver_id`),
  KEY `rider_id` (`rider_id`),
  CONSTRAINT `ride_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `ride_ibfk_2` FOREIGN KEY (`rider_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ride`
--

LOCK TABLES `ride` WRITE;
/*!40000 ALTER TABLE `ride` DISABLE KEYS */;
/*!40000 ALTER TABLE `ride` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sos_alert`
--

DROP TABLE IF EXISTS `sos_alert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sos_alert` (
  `alert_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `ride_id` int NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `user_id` (`user_id`),
  KEY `ride_id` (`ride_id`),
  CONSTRAINT `sos_alert_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `sos_alert_ibfk_2` FOREIGN KEY (`ride_id`) REFERENCES `ride` (`ride_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sos_alert`
--

LOCK TABLES `sos_alert` WRITE;
/*!40000 ALTER TABLE `sos_alert` DISABLE KEYS */;
/*!40000 ALTER TABLE `sos_alert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking`
--

DROP TABLE IF EXISTS `tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking` (
  `tracking_id` int NOT NULL AUTO_INCREMENT,
  `ride_id` int NOT NULL,
  `current_location` varchar(255) DEFAULT NULL,
  `estimated_time_of_arrival` datetime DEFAULT NULL,
  `status` enum('On-going','Completed','Cancelled') DEFAULT NULL,
  `traffic_conditions` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tracking_id`),
  KEY `ride_id` (`ride_id`),
  CONSTRAINT `tracking_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `ride` (`ride_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking`
--

LOCK TABLES `tracking` WRITE;
/*!40000 ALTER TABLE `tracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `UserType` enum('Admin','Rider','Driver') DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rakib Hasan','mrabbi2230953@bscse.uiu.ac.bd','01631457128','Male','$2b$10$hW2JytOGOs3kag.JqGBwy.52zCdY52YNnRVhSnGGHYTkUV0bridJO','Rider'),(2,'Mominul','mominul@gmail.com','01560056059','Other','$2b$10$4Eo54w.j/VFdWQj5aqDtku3G9y7cFU1rG4uVZme5.xUYvsIyP1nXm','Driver'),(3,'Rakib','rakib@gmail.com','0173456758','Male','$2b$10$QBaF0JK4/wOrruU60DOoqe57rd92.2myeAKVSgkKUr8pKnKG4mprq','Rider'),(4,'sajid','sajiud@gmail.com','01651456278','Male','$2b$10$TT0.yBWlnt/aaRZFgXu3SODAWiztHohHj4l969g6LvB3AYVonXnhy','Driver'),(5,'Akib','Akib@gmail.com','01657654987','Male','$2b$10$XBWDvn0pSOOObUKuPAC/Z.A.2MALqbp6vwsqngu.iheWHZJco67KW','Driver'),(6,'Sanjida','sanjida@gmail.com','01657654988','Female','$2b$10$xRjinSAWV7cg6Xf1eBQUlen1Nl.NZdsxB4sFO5X5bKucyyXJodFWq','Admin'),(7,'Sadman','sadman@gmail.com','017658763435','Male','$2b$10$j0DrIniEkVe9bEYbC0aQ..XaUXa3oFLnLHfoKPB7elV2ZRYzGupfS','Admin'),(8,'aaa','aaa@gmail.com','01976834567','Male','$2b$10$Ke9TIpS5qXMocu2vWPzG/.pvfogEnSkOi.MVg/kddW5Hr/iYxJ06a','Admin'),(9,'Talha','talha@gmail.com','01976498734','Male','$2b$10$KIR4RnKuliNJ7/N6oN9KA.p8du8291D1YBoj6L3VEsPm7UmJbqBb2','Driver');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `vehicle_type` enum('Car','Bike','SUV') DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `driver_id` int NOT NULL,
  PRIMARY KEY (`vehicle_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (1,'Car','Toyota Axio',4,4),(2,'Bike','Yamaha FZS',2,2);
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `women_only_ride`
--

DROP TABLE IF EXISTS `women_only_ride`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `women_only_ride` (
  `ride_id` int NOT NULL AUTO_INCREMENT,
  `pickup_location` varchar(255) DEFAULT NULL,
  `dropoff_location` varchar(255) DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  `driver_id` int NOT NULL,
  `rider_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `vehicle_id` int NOT NULL,
  PRIMARY KEY (`ride_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `driver_id` (`driver_id`),
  KEY `rider_id` (`rider_id`),
  CONSTRAINT `women_only_ride_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`),
  CONSTRAINT `women_only_ride_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `women_only_ride_ibfk_3` FOREIGN KEY (`rider_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `women_only_ride`
--

LOCK TABLES `women_only_ride` WRITE;
/*!40000 ALTER TABLE `women_only_ride` DISABLE KEYS */;
/*!40000 ALTER TABLE `women_only_ride` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-26 11:49:37
