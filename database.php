<?php 
    $servername = "localhost"; 
    $username = "root"; 
    $password = "1234"; 
    $dbname = "agile_team"; 
     
    // Connect the database with the server 
    $conn = new mysqli(hostname: $servername, $username, $password, $dbname); 
     
    // If error occurs  
    if ($conn->connect_errno) {
        error_log("Failed to connect to MySQL: " . $conn->connect_error); // Log error to error log
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    } 

    header('Content-Type: application/json'); // Set header to application/json

    $action = $_POST['action'];

    if ($action == 'fetch_sprint_stories') {
        $sql = "SELECT * FROM user_story INNER JOIN sprint ON user_story.phase_number = sprint.phase_number WHERE current_sprint = 'Yes'";
        if (isset($_POST['itemText'])) {
          $selectedText = $_POST['itemText'];
          $sql .= "AND status = ?";
        }
    
        // Prepare the SQL statement
        $stmt = $conn->prepare($sql);
        
        // Bind parameters if they exist
        if (isset($selectedText)) {
            $stmt->bind_param("s", $selectedText);
        }
    
        // Execute the prepared statement
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
    
            echo json_encode($data); // Send data as JSON
        } else {
            error_log("SQL Error: " . $stmt->error);
            echo json_encode(['error' => 'Database query failed']);
        }
    
        // Close statement
        $stmt->close();
     } else if ($action == 'fetch_assign_members') {
        $sql = "
        SELECT * 
        FROM assign_user_story
        INNER JOIN employee ON employee.employee_id = assign_user_story.employee_id
        WHERE user_story_name = ";
        if (isset($_POST['itemText'])) {
            $selectedText = $_POST['itemText'];
            $sql .= "?";
        }
    
        // Prepare the SQL statement
        $stmt = $conn->prepare($sql);
        
        // Bind parameters if they exist
        if (isset($selectedText)) {
            $stmt->bind_param("s", $selectedText);
        }
    
        // Execute the prepared statement
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
    
            echo json_encode($data); // Send data as JSON
        } else {
            error_log("SQL Error: " . $stmt->error);
            echo json_encode(['error' => 'Database query failed']);
        } 
    
        // Close statement
        $stmt->close();
     } else if ($action == 'fetch_story_points') {
        $sql = "
        SELECT * 
        FROM user_story
        WHERE user_story_name = ";
        if (isset($_POST['itemText'])) {
            $selectedText = $_POST['itemText'];
            $sql .= "?";
        }
    
        // Prepare the SQL statement
        $stmt = $conn->prepare($sql);
        
        // Bind parameters if they exist
        if (isset($selectedText)) {
            $stmt->bind_param("s", $selectedText);
        }
    
        // Execute the prepared statement
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
    
            echo json_encode($data); // Send data as JSON
        } else {
            error_log("SQL Error: " . $stmt->error);
            echo json_encode(['error' => 'Database query failed']);
        }
        $stmt->close();
    } else if ($action == 'updateStatus') {
        if (isset($_POST['newStatusText'])) {
            $newStatus = $_POST['newStatusText'];
            $userStory = $_POST['userStoryText'];
        }
        $sql = "UPDATE user_story SET status = ? WHERE user_story_name = ?";
        // Prepare the SQL statement
        $stmt = $conn->prepare($sql);
        
        // Bind parameters to the prepared statement
        $stmt->bind_param("ss", $newStatus, $userStory);
    
        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Record inserted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
        }
    
        // Close statement
        $stmt->close();
    }   else if ($action == 'fetch_sprint') {
            $sql = "SELECT phase FROM sprint WHERE current_sprint = 'Yes'";
    
            // Prepare the SQL statement
            $stmt = $conn->prepare($sql);
            
            // Bind parameters to the prepared statement
            //$stmt->bind_param("ss", $newStatus, $userStory);
        
            // Execute the statement
            if ($stmt->execute()) {
                $result = $stmt->get_result();
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
    
            echo json_encode($data); // Send data as JSON
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
            }
        
            // Close statement
            $stmt->close();
            } 
            else if ($action == 'updatePhase') {
                if (isset($_POST['newPhaseText'])) {
                    $newPhase = $_POST['newPhaseText'];
                    $phaseNumber = $_POST['phaseNumberText'];
                }
                $sql = "UPDATE sprint SET phase = ? WHERE phase_number = ?";
        
                // Prepare the SQL statement
                $stmt = $conn->prepare($sql);
                
                // Bind parameters to the prepared statement
                $stmt->bind_param("ss", $newPhase, $phaseNumber);
            
                // Execute the statement
                if ($stmt->execute()) {
                    //echo json_encode(['status' => 'success', 'message' => 'Record inserted successfully']);
                    echo json_encode($newPhase.$phaseNumber);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
                }
            
                // Close statement
                $stmt->close();
            }
    $conn->close();
     
?>