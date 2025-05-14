<?php 

// Including main.php
include 'main.php';

// Validating Form Data
if (!isset($_POST['name'], $_POST['email'])) {
    exit("Please enter a valid name and email address!");
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    exit("Please enter a valid email address!");
}

if (!preg_match('/^[a-zA-Z\s]+$/', $_POST['name'])) {
    exit("Name must contain only letters!");
}

// Selecting Account from the database
$stmt = $pdo -> prepare('SELECT * FROM accounts WHERE email = ?');
$stmt -> execute([$_POST['email']]);

// Fetching the results and return them as an associative array
$accounts = $stmt -> fetch(PDO::FETCH_ASSOC);

// Checking if the account exists
if ($account) {

    // If exists (user/operator)
    if ($account['role'] == "Operator" || $account["role"] == "Admin") {
        
        // If user is an operator
        exit('Please use the <a href="admin/">admin panel</a> to login.');
    } else if ($account["role"] == "Guest") {

        // The User is guest, authenticating the user
        if (authenticate_required && !isset($_POST['password'])) {
            exit("MSG_LOGIN_REQUIRED");
        }
        
        if (!empty($account['password'])) {
            if (isset($_POST['password']) && password_verify($_POST['password'], $account['password'])) {
                
                // If the password is correct, authenticate the user
                $_SESSION['chat_widget_account_loggedin'] = TRUE;
                $_SESSION['chat_widget_account_id'] = $account['id'];
                $_SESSION['chat_widget_account_role'] = $account['role'];

                // Updating the Code
                update_info($pdo, $account['id'], $account['email'], $account['secret']);

                // Showing Success Message
                exit('MSG_SUCCESS');
            } else {
                // Invalid Password
                exit("Invalid Credentials!");
            }
        } else {
            $_SESSION['chat_widget_account_loggedin'] = TRUE;
            $_SESSION['chat_widget_account_id'] = $account['id'];
            $_SESSION['chat_widget_account_role'] = $account['role'];

            // Updating the Code
            update_info($pdo, $account['id'], $account['email'], $account['secret']);

            // Showing Success Message
            exit('MSG_SUCCESS');
        }
    } 
} else {
        
    // If the Authentication is required
    if (authentication_required && !isset($_POST["password"])) {
        exit("MSG_LOGIN_REQUIRED");
    }

    // Hashing the password
    $password = isset($_POST['password']) ? password_hash($_POST['password'], PASSWORD_DEFAULT) : "";

    // If account does not exists, create one
    $stmt = $pdo -> prepare('INSERT INTO accounts (email, password, full_name, role, last_seen, registered) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt -> execute([$_POST['email'], $password, $_POST['name'] ? $_POST['name'] : "Guest", "Guest", date('Y-m-d H:i:s'), date("Y-m-d H:i:s")]);

    // Retrieving the account ID
    $id = $pdo -> lastInsertedId();

    // Authenticating the new user
    $_SESSION['chat_widget_account_loggedin'] = TRUE;
    $_SESSION['chat_widget_account_id'] = $account['id'];
    $_SESSION['chat_widget_account_role'] = $account['role'];

    // Updating the Code
    update_info($pdo, $account['id'], $account['email'], $account['secret']);

    // Showing Success Message
    exit('MSG_SUCCESS');
}

?>