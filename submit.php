<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: testcontact.php');
    exit;
}

// Sanitize inputs
$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
$message = htmlspecialchars($_POST['message']);

// Cloudflare Worker endpoint
$workerUrl = 'https://rjcontact.roshanjosephrsj.workers.dev/';

// Prepare data for D1
$data = [
    'name' => $name,
    'email' => $email,
    'message' => $message
];

// Send to Cloudflare Worker
$ch = curl_init($workerUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_SECRET_TOKEN'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    die('Error submitting form');
}

// Show confirmation page
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Submitted</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
            padding: 0 20px;
        }
        .container {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
        }
        .success-message {
            color: #4CAF50;
            font-size: 1.2em;
            margin-bottom: 20px;
        }
        .submitted-data {
            background-color: white;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-message">✅ Form submitted successfully!</div>
        
        <div class="submitted-data">
            <h3>Submitted Information:</h3>
            <p><strong>Name:</strong> <?php echo $name; ?></p>
            <p><strong>Email:</strong> <?php echo $email; ?></p>
            <p><strong>Message:</strong> <?php echo nl2br($message); ?></p>
        </div>
        
        <p style="margin-top: 20px;">
            <a href="index.php">&laquo; Back to form</a>
        </p>
    </div>
</body>
</html>