-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 29, 2023 at 11:57 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacationland`
--
CREATE DATABASE IF NOT EXISTS `vacationland` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacationland`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`userId`, `vacationId`) VALUES
(3, 18),
(3, 33),
(3, 21),
(3, 34),
(3, 29),
(3, 35),
(3, 26),
(3, 36),
(3, 39),
(3, 42),
(4, 18),
(4, 34),
(4, 42),
(4, 21),
(4, 36),
(5, 18),
(5, 33),
(5, 34),
(5, 36),
(6, 18),
(6, 34),
(6, 39),
(6, 26),
(7, 18),
(7, 35),
(7, 21),
(8, 18),
(8, 34),
(8, 29),
(8, 24),
(4, 29),
(8, 36);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`roleId`, `roleName`) VALUES
(1, 'User'),
(2, 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `roleId`, `firstName`, `lastName`, `username`, `password`) VALUES
(1, 2, 'aragorn', 'strider', 'aragornstrider', '4572f90ee00d6f65724457030d071722a097213d14c9f2eddcd1ab50deff1a9c2b74678658662bdcd08a920a35775aed506d9255a820f2aa725fc9a11ae7b857'),
(3, 1, 'Gandalf', 'The Gray', 'gandalfthegray', 'caa13526ca64de6316f17b0243ec157aab8c55cdedad73f20724f51d3101d0a06918d617bb425c4e01f0042e4430145f7711dd77fac498a6ef8cad452235f53c'),
(4, 1, 'Jeannie', 'The Labrador', 'jeannie', '42b3000bcd2642d3c4590f3d4fe1196d0c902ac60340f2621d41b7cc76296a01f4520fe7e776ef9e08748e43878a650d7ce7b27e97ef15412d51f29f819576de'),
(5, 1, 'Wain', 'Rooney', 'wainrooney', '426de140818424efcb213a17e463050fea66553f3cb44083ee5d29e52548d746f11dbd1c029a44a1101202820a1889533556a54af167f049726d8529b616f2ba'),
(6, 1, 'Sam Wise ', 'Gamgee', 'samwisegamgee', '22d3e14a71adaad898f53c38467b12f0f6ba524cdd74f73c78f2a96d9af302500ea6a8620e21d3c95c99fc30a62ac0928e7ad18790c736a2f2d811a06225f44d'),
(7, 1, 'Saruman ', 'The White', 'saruman ', 'fbf5ead7b43e873f3a23e94ddc4b883e709b51f9dec127a6d0b9142f80e3710eb80864e44f2cdd0eab6ef75579f099b776894d99f4a904295cf2482795303455'),
(8, 1, 'Frodo', 'Baggins', 'frodobaggins', '5a507def90283764ca36a99f6501152f121765c7aeb4f5af0b03db637c88d1b289c161f4e748dc1841c129bfefdb6159e7cd23b9da4e128f426b104d34dfb011');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `destination` varchar(30) NOT NULL,
  `imageName` varchar(80) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `description`, `destination`, `imageName`, `startDate`, `endDate`, `price`) VALUES
(18, 'A must trip to Hobbiton for Lord of the Rings fans', 'Hobbiton', 'fb313e46-1e99-4364-bc23-a869d24f8226.jpg', '2023-06-20', '2023-06-28', 1100),
(19, 'The ultimate back horse riding trip in the wilderness of iceland \r\n\r\n', 'Iceland', 'a8e1b29f-fd62-4973-9b0c-3e10bca66787.jpg', '2023-06-18', '2023-06-24', 670),
(20, 'For beach lovers, it doesn\'t get much better than Greece. Boasting hundreds of inhabited islands and thousands of miles of coastline, the country is home to an astonishing number of golden stretches of sand, lapped by the crystalline waters of the Ionian and Aegean Sea. Come and take some time off and relax on some of top beaches in Greece', 'Greece', '9bdd2f59-ba72-4ebf-be30-6c694ec26287.jpg', '2023-06-06', '2023-06-09', 249),
(21, 'Make your dreams com true and experience the full Disneyland packag', 'Disneyland, L.A', '568182e3-8a7b-4144-8a27-80b08401d2cf.jpg', '2023-05-20', '2023-05-24', 380),
(22, 'njoy the magical tone Bled', 'Bled', '704474f6-c890-4ac6-89fe-43542bad5fdc.jpg', '2023-05-16', '2023-05-22', 150),
(23, 'Witness the colourful flowers of the Netherlands', 'Netherlands', '3595dbb4-85e7-4f6c-af5f-a2a487b6305b.jpg', '2023-03-19', '2023-04-23', 220),
(24, 'Enjoy the northern lights, also named the borealis. See beautiful dancing waves of light that have captivated people for millennia', 'Iceland Lights', '2bf93408-81b6-4d28-a082-8955b35bfa56.webp', '2023-03-26', '2023-03-31', 800),
(25, 'This Mountain climbing trip will stay withe you all your life.\r\nCome climb the most iconic mountains of Alaska', 'Alaska', 'be3c8c7e-1476-4729-bb46-e7043f728eb8.jpg', '2023-02-21', '2023-02-28', 900),
(26, 'Beautiful beaches with sunshine all year long! ', 'Bahamas!', '25377a69-7a24-4e49-90fa-f59860acb104.jpg', '2023-02-20', '2023-02-28', 630),
(27, 'See the best that Paris has to offer', 'Paris', '0c46a05a-adff-4014-b3d8-9f3f7c234547.jpg', '2023-02-16', '2023-02-23', 400),
(28, 'Enjoy the great culture of London.\r\nYou will see great historic buildings, eat great pub meals, drink the best beers in the world and experience an Amazing musicals', 'London', '28b787ff-18e8-4c53-b203-354eb750acba.jpg', '2023-02-15', '2023-02-20', 450),
(29, 'Come and explore the wildlife of Kenya', 'Kenya', 'ea3ec036-06d9-4572-88b8-5f2a0f5a01cf.jpg', '2023-04-10', '2023-04-24', 2000),
(30, 'Known for it\'s amazing mountains, the Dolomites is a perfect place to enjoy amazing views', 'Dolomites, Italy', '77b7f98f-5b5c-4cd0-adfa-22f9e3d2b830.jpg', '2023-01-31', '2023-02-15', 300),
(31, 'This is a surprise location where you will discover the most amazing desert in the world', 'Desert Land', '207d28e8-ed93-4b82-b702-bc90c2c4476d.jpg', '2023-01-29', '2023-01-31', 300),
(32, 'The nature reserve (175 Acres) in the Sharon, south of the Givat Olga neighborhood (Hadera)\r\n\r\nIt is named after Tel Gador, located at its end\r\n\r\nTo the west is the Yam Gador nature reserve, which includes 7km of shoreline. The reserve represents a cross section of the coastal plain with its sandstone ridges, and rolling valleys in between', 'Gador Nature Reserve', '2ca6ea09-afae-412e-a69c-b593d59bb7c0.jpeg', '2023-01-28', '2023-01-28', 10),
(33, 'Explore the most famous national park in America full of wildlife and volcanic pools', 'Yellowstone', '86642b68-2396-4cb6-a8fb-6c046c946a57.jpg', '2023-05-22', '2023-06-05', 420),
(34, 'One of the most beautiful places on earth', 'Yosemite', '01e08a54-7323-4da4-aaa5-f154e439fede.jpg', '2023-05-19', '2023-05-23', 70),
(35, 'The place where it all began and the place where it must end\r\n\r\nA visit to the city of orcs and the home of Sauron', 'Mordor', 'f922e630-63f1-4ceb-90e3-368f94be87aa.webp', '2023-03-08', '2023-03-14', 820),
(36, 'Come explore the city where John Paul George and Ringo formed the Beatles and made the music that changed the world', 'Liverpool', 'cefdfab5-4aa3-4e19-846d-493faf880a70.jpg', '2023-03-07', '2023-03-16', 180),
(37, 'A place where nature has formed the most amazing and unique structures and shapes', 'Arches', '3e174f13-bfe4-410d-adbc-ae06d63c61f0.jpg', '2023-02-05', '2023-02-09', 140),
(38, 'Be amazed by huge cacti.\r\nThe saguaro is a tree-like cactus species in the monotypic genus Carnegiea that can grow to be over 12 meters tall!!!', 'Saguaro, Arizona', '80f7a9bf-aaef-4590-84e4-c4131a4c2cb9.jpg', '2023-03-05', '2023-03-06', 70),
(39, 'The white city of the one true king', 'Gondor', '0b3553b9-92e7-4de0-b90f-4ec487131d95.webp', '2023-03-01', '2023-03-04', 120),
(40, 'The iconic mountain that is the famous for being the symbol of to Toblerone chocolate\r\n\r\nEnjoy the pure beauty of the mountain', 'Matterhorn ', '83bafd7f-afc6-41a2-86bf-3108f9d057cd.jpg', '2023-02-20', '2023-02-27', 520),
(41, 'Climb the highest mountain in Africa reaching near 6000 meters!', 'Mount Kilimanjaro', '6c6a5687-ba88-4172-80cf-4ea0c2326f8e.jpg', '2023-02-16', '2023-02-27', 700),
(42, 'These huge waterfalls are so stunning that you have to see them in real life to truly appreciate this nature wonder', 'Iguazu Falls, Brszil', 'c140c5b1-66be-4c19-a05b-e768672a1cf6.jpg', '2023-02-02', '2023-02-08', 920),
(43, 'This is a horseshoe-shaped incised meander of the Colorado River located near the town of Page, Arizona, United States. It is also referred to as the \"east rim of the Grand Canyon.\r\n\r\nThis place is one place you can\'t miss', 'Horseshoe Bend', 'e5b73a41-b7c2-492f-bdae-cf93ffcf9da0.jpg', '2023-04-16', '2023-04-22', 145);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
