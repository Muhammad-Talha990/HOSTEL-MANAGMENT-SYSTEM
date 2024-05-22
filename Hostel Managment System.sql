
CREATE DATABASE HostelManagement;

USE HostelManagement;

-- Table: Rooms
CREATE TABLE Rooms (
    RoomID INT PRIMARY KEY,
    RoomType VARCHAR(50),
    Capacity INT,
    Price DECIMAL(10, 2)
);

-- Table: Students
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(15),
    RoomID INT,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

-- Table: Bookings
CREATE TABLE Bookings (
    BookingID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    CheckInDate DATE,
    CheckOutDate DATE,
    PlanID INT,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (PlanID) REFERENCES MealPlans(PlanID)    
);

drop table Students;
drop table MealPlans;
drop table Bookings;



-- Table: Staff
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY,
    Name VARCHAR(100),
    Position VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(15)
);

-- Table: Facilities
CREATE TABLE Facilities (
    FacilityID INT PRIMARY KEY,
    FacilityName VARCHAR(100),
    Description TEXT,
    Status BOOLEAN DEFAULT TRUE
);

-- Table: Payments
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    Amount DECIMAL(10, 2),
    PaymentDate DATE,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

-- Table: Maintenance
CREATE TABLE Maintenance (
    MaintenanceID INT PRIMARY KEY AUTO_INCREMENT,
    FacilityID INT,
    ScheduledDate DATE,
    CompletedDate DATE,
    FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID)
);

-- Table: Complaints
CREATE TABLE Complaints (
    ComplaintID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    IssueDescription TEXT,
    DateReported DATE,
    Status VARCHAR(20),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

-- Table: SecurityLogs
CREATE TABLE SecurityLogs (
    LogID INT PRIMARY KEY AUTO_INCREMENT,
    EventDescription TEXT,
    OccurredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE MealPlans (
    PlanID INT PRIMARY KEY,
    PlanName VARCHAR(50),
    Cost DECIMAL(10, 2),
    Description TEXT
);

INSERT INTO Rooms (RoomID, RoomType, Capacity, Price) VALUES
(101, 'Single', 1, 5000),
(102, 'Double', 2, 7000),
(103, 'Triple', 3, 9000),
(104, 'Quad', 4, 11000),
(105, 'Penthouse', 5, 13000),
(106, 'Luxury Suite', 6, 16000);

INSERT INTO Students (StudentID, Name, Email, Phone, RoomID) VALUES
(201, 'John Doe', 'john.doe@example.com', '1234567890', 101),
(202, 'Jane Smith', 'jane.smith@example.com', '0987654321', 102),
(203, 'Alice Johnson', 'alice.johnson@example.com', '1122334455', 103),
(204, 'Bob Brown', 'bob.brown@example.com', '1333445566', 104),
(205, 'Charlie Davis', 'charlie.davis@example.com', '1444556677', 105),
(206, 'Diana Evans', 'diana.evans@example.com', '1555667788', 106);

INSERT INTO Bookings (StudentID, CheckInDate, CheckOutDate) VALUES
(201, '2024-06-01', '2024-06-30'), -- Booking for John Doe
(202, '2024-07-01', '2024-07-31'), -- Booking for Jane Smith
(203, '2024-08-01', '2024-08-31'), -- Booking for Alice Johnson
(204, '2024-09-01', '2024-09-30'), -- Booking for Bob Brown
(205, '2024-10-01', '2024-10-31'), -- Booking for Charlie Davis
(206, '2024-11-01', '2024-11-30'); -- Booking for Diana Evans

INSERT INTO Staff (StaffID, Name, Position, Email, Phone) VALUES
(301, 'Mr. John Doe', 'Warden', 'warden@hostel.com', '+1234567890'),
(302, 'Ms. Jane Smith', 'Caretaker', 'caretaker@hostel.com', '+0987654321'),
(303, 'Dr. Richard Roe', 'Doctor', 'doctor@hostel.com', '+1666778899'),
(304, 'Mrs. Susan Taylor', 'Housekeeper', 'housekeeper@hostel.com', '+1777889900'),
(305, 'Mr. Thomas Underwood', 'Janitor', 'janitor@hostel.com', '+1888990111'),
(306, 'Miss Victoria Wilson', 'Receptionist', 'receptionist@hostel.com', '+1999112222');

INSERT INTO Facilities (FacilityID, FacilityName, Description, Status) VALUES
(401, 'Gym', 'Fully equipped gym for students.', TRUE),
(402, 'Laundry', '24-hour laundry service.', FALSE),
(403, 'Library', 'Well-stocked library for study.', TRUE),
(404, 'Cafeteria', 'On-site cafeteria serving meals.', TRUE),
(405, 'Common Area', 'Space for socializing and events.', TRUE),
(406, 'Parking Lot', 'Secure parking for vehicles.', TRUE);

INSERT INTO Payments (StudentID, Amount, PaymentDate) VALUES
(201, 15000, '2024-06-01'),
(202, 20000, '2024-07-01'),
(203, 25000, '2024-08-01'),
(204, 30000, '2024-09-01'),
(205, 35000, '2024-10-01'),
(206, 40000, '2024-11-01');

INSERT INTO Maintenance (FacilityID, ScheduledDate, CompletedDate) VALUES
(401, '2024-06-15', '2024-06-17'),
(402, '2024-07-10', NULL),
(403, '2024-08-25', '2024-08-27'),
(404, '2024-09-15', '2024-09-17'),
(405, '2024-10-05', '2024-10-07'),
(406, '2024-11-20', '2024-11-22');

INSERT INTO Complaints (StudentID, IssueDescription, DateReported, Status) VALUES
(201, 'Broken window in room 101', '2024-06-02', 'Pending'),
(202, 'Faulty AC in room 102', '2024-07-03', 'Resolved'),
(203, 'Leaking roof in common area', '2024-08-04', 'Investigating'),
(204, 'Missing items in laundry', '2024-09-05', 'Resolved'),
(205, 'No hot water in showers', '2024-10-06', 'Pending'),
(206, 'Loud noise disturbance at night', '2024-11-07', 'Investigating');

INSERT INTO SecurityLogs (EventDescription) VALUES
('Door access granted to John Doe at 08:00 AM'),
('Security breach detected at 09:00 PM'),
('Fire alarm triggered at 10:00 PM'),
('Emergency exit door opened at 11:00 PM'),
('Unauthorized person spotted in restricted area at 12:00 AM'),
('Security camera malfunction at 01:00 AM');

INSERT INTO MealPlans (PlanID, PlanName, Cost, Description) VALUES
(504, 'Vegetarian', 1150, 'Three meals per day with vegetarian options.'),
(505, 'Gluten-Free', 1250, 'Three meals per day with gluten-free options.'),
(506, 'Vegan', 1350, 'Three meals per day with vegan options.'),
(507, 'Halal', 1450, 'Three meals per day with halal options.'),
(508, 'Kosher', 1550, 'Three meals per day with kosher options.'),
(509, 'Custom', 1650, 'Three meals per day with custom dietary needs.');

DELIMITER //
CREATE PROCEDURE CalculateTotalEarnings()
BEGIN
    SELECT SUM(Price) AS TotalEarnings FROM Rooms;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER UpdateFacilityStatusAfterMaintenance
AFTER UPDATE ON Maintenance FOR EACH ROW
BEGIN
    IF NEW.CompletedDate IS NOT NULL THEN
        UPDATE Facilities SET Status = TRUE WHERE FacilityID = NEW.FacilityID;
    END IF;
END //
DELIMITER ;

-- QUERIES 

SELECT RoomID, RoomType, Price FROM Rooms;

SELECT * FROM Complaints WHERE StudentID = 202;

SELECT * FROM SecurityLogs WHERE OccurredAt >= CURDATE();

SELECT RoomType, AVG(Price) AS AveragePrice FROM Rooms GROUP BY RoomType;

SELECT PlanName, Cost FROM MealPlans;

SELECT SUM(Cost) AS TotalMealPlanCost FROM MealPlans;

SELECT DISTINCT s.Name FROM Students s JOIN Bookings b ON s.StudentID = b.StudentID JOIN MealPlans mp ON b.PlanID = mp.PlanID WHERE mp.PlanID = 503;

SELECT FacilityName, Status FROM Facilities;

SELECT Status, COUNT(*) AS NumberOfComplaints FROM Complaints GROUP BY Status;

SELECT MONTH(PaymentDate) AS Month, AVG(Amount) AS AveragePayment FROM Payments GROUP BY Month ORDER BY Month ASC;

SELECT Name, Position FROM Staff;

SELECT b.CheckInDate, b.CheckOutDate FROM Bookings b JOIN Students s ON b.StudentID = s.StudentID JOIN Rooms r ON s.RoomID = r.RoomID WHERE r.RoomType = 'Single';


SELECT SUM(Amount) AS TotalRevenue FROM Payments;

SELECT EventDescription FROM SecurityLogs WHERE MONTH(OccurredAt) = 7 AND YEAR(OccurredAt) = 2024;

SELECT AVG(Capacity) AS AverageCapacity FROM Rooms;

SELECT s.Name FROM Students s LEFT JOIN Payments p ON s.StudentID = p.StudentID WHERE p.PaymentID IS NULL;

SELECT COUNT(*) AS ResolvedComplaints FROM Complaints WHERE Status = 'Resolved';

SELECT MIN(CheckInDate) AS EarliestCheckIn FROM Bookings;

SELECT s.Name FROM Students s JOIN Bookings b ON s.StudentID = b.StudentID WHERE b.CheckInDate IS NULL;

SELECT Name FROM Staff WHERE Email LIKE'%@hostel.com';


-- Find all bookings made by a specific student along with the meal plan details

SELECT b.StudentID, b.CheckInDate, b.CheckOutDate, mp.PlanName, mp.Cost
FROM Bookings b
JOIN Students s ON b.StudentID = s.StudentID
JOIN MealPlans mp ON b.PlanID = mp.PlanID
WHERE s.Name = 'John Doe';


-- List all facilities and their status grouped by whether they are currently available

SELECT Status, COUNT(*) AS NumberOfFacilities
FROM Facilities
GROUP BY Status;

select * from students;

-- Find the total cost of all payments made by a specific student

SELECT SUM(p.Amount) AS TotalPayments
FROM Payments p
JOIN Students s ON p.StudentID = s.StudentID
WHERE s.Name = 'Jane Smith';


-- Calculate the average price of rooms by type

SELECT RoomType, AVG(Price) AS AveragePrice
FROM Rooms
GROUP BY RoomType;


-- Find the month with the highest total payment amount

SELECT MONTH(PaymentDate) AS Month, MAX(Amount) AS HighestPayment
FROM Payments
GROUP BY Month;


-- Procedure to calculate the total earnings from all rooms

CALL CalculateTotalEarnings();



-- Find all students who have not paid yet

SELECT s.Name
FROM Students s
LEFT JOIN Payments p ON s.StudentID = p.StudentID
WHERE p.PaymentID IS NULL;


-- Count the number of complaints resolved and pending

SELECT Status, COUNT(*) AS Count
FROM Complaints
GROUP BY Status;


-- Find the earliest check-in date among all bookings

SELECT MIN(b.CheckInDate) AS EarliestCheckIn
FROM Bookings b;