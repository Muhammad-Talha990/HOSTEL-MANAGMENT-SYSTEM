CONNECTION

<?php
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "HostelManagement";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: ". $conn->connect_error);
}
?>


FETCH

<?php
include 'db_connect.php';
$sql = "SELECT RoomID, RoomType, Price FROM Rooms";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: ". $row["RoomID"]. " - Type: ". $row["RoomType"]. " - Price: ". $row["Price"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>

INSERT

<?php
include 'db_connect.php';

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$roomID = $_POST['roomID'];

$sql = "INSERT INTO Students (Name, Email, Phone, RoomID) VALUES ('$name', '$email', '$phone', $roomID)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: ". $sql. "<br>". $conn->error;
}

$conn->close();
?>


UPDATE

<?php
include 'db_connect.php';

$facilityID = $_GET['facilityID'];
$status = $_GET['status'];

$sql = "UPDATE Facilities SET Status=$status WHERE FacilityID=$facilityID";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: ". $conn->error;
}

$conn->close();
?>


DELETE

<?php
include 'db_connect.php';

$studentID = $_GET['studentID'];

$sql = "DELETE FROM Students WHERE StudentID=$studentID";

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: ". $conn->error;
}

$conn->close();
?>
