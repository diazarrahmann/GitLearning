<?php

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $npk_input = $_POST['npk_user'];
    $password_input = $_POST['password_asli'];

    // Hash password input
    $password_hash_input = hash('sha256', $password_input);

    // Koneksi SQL Server
    $serverName = 'MSI\SQLEXPRESS';

    $connectionOptions = [
        "Database" => "gitLearning",
        "Uid" => "zaid",
        "PWD" => "akukamu",
        "Encrypt" => false,
        "TrustServerCertificate" => true
    ];

    $conn = sqlsrv_connect($serverName, $connectionOptions);

    // Cek koneksi
    if ($conn === false) {

        echo json_encode([
            "status" => "error",
            "message" => "Koneksi ke database gagal.",
            "details" => sqlsrv_errors()
        ]);

        exit;
    }

    // Query database
    $sql = "SELECT npk 
            FROM dbo.login 
            WHERE npk = ? 
            AND passwordHash = ?";

    $params = [
        $npk_input,
        $password_hash_input
    ];

    // Jalankan query
    $stmt = sqlsrv_query($conn, $sql, $params);

    // Cek query
    if ($stmt === false) {

        echo json_encode([
            "status" => "error",
            "message" => "Kesalahan pada query database.",
            "details" => sqlsrv_errors()
        ]);

        exit;
    }

    // Ambil data
    $user_found = sqlsrv_fetch_array(
        $stmt,
        SQLSRV_FETCH_ASSOC
    );

    if ($user_found) {

        echo json_encode([
            "status" => "success",
            "message" => "Login berhasil.",
            "data" => [
                "npk" => $user_found["npk"]
            ]
        ]);

    } else {

        echo json_encode([
            "status" => "failed",
            "message" => "NPK tidak terdaftar atau password salah."
        ]);
    }

    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Metode akses ditolak."
    ]);
}

?>