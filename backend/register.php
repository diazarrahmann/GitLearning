<?php

header ('Content-Type:application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $npk_input = $_POST ['npk_user'];
    $password_input = $_POST ['password_asli'];

    $password_hash_input = hash('sha256', $password_input);
    
    $serverName = 'MSI\SQLEXPRESS';

    $connectionOptions = [
        "Database" => "gitLearning",
        "Uid" => "zaid",
        "PWD" => "akukamu",
        "Encrypt" => false,
        "TrustServerCertificate" => true
    ];

    $conn = sqlsrv_connect($serverName, $connectionOptions);

    if ($conn === false) {
        echo json_encode([
            "status" => "error",
            "message" => "Koneksi ke sql gagal",
            "details" => sqlsrv_errors()
        ]);

        exit;
    }

    //Cek NPK sudah terdaftar
    $sql_check = "SELECT npk FROM dbo.login WHERE npk = ?";
    $params_check = [$npk_input];

    $stmt_check = sqlsrv_query($conn, $sql_check, $params_check);

    if ($stmt_check === false) {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal mengecek NPK",
            "details" => sqlsrv_errors()
        ]);

        sqlsrv_close($conn);
        exit;
    }

    //kalo NPK udah ada
    $user = sqlsrv_fetch_array(
        $stmt_check, SQLSRV_FETCH_ASSOC
    );

    if ($user) {
        echo json_encode([
            "status" => "failed",
            "message" => "NPK sudah terdaftar"
        ]);

        sqlsrv_free_stmt($stmt_check);
        sqlsrv_close($conn);
        exit;
    }

    $sql_insert = "INSERT INTO dbo.login (npk, passwordHash)
               VALUES (?, ?)";

$params_insert = [
    $npk_input,
    $password_hash_input
];

$stmt_insert = sqlsrv_query(
    $conn,
    $sql_insert,
    $params_insert
);

if ($stmt_insert === false) {
    echo json_encode([
        "status" => "error",
        "message" => "Registrasi gagal",
        "details" => sqlsrv_errors()
    ]);

    sqlsrv_close($conn);
    exit;
}


// Cek kembali data yang baru dimasukkan
$sql_verify = "SELECT npk, passwordHash
               FROM dbo.login
               WHERE npk = ?";

$stmt_verify = sqlsrv_query(
    $conn,
    $sql_verify,
    [$npk_input]
);

if ($stmt_verify === false) {
    echo json_encode([
        "status" => "error",
        "message" => "INSERT berhasil tetapi gagal melakukan pengecekan",
        "details" => sqlsrv_errors()
    ]);

    sqlsrv_close($conn);
    exit;
}

$data = sqlsrv_fetch_array(
    $stmt_verify,
    SQLSRV_FETCH_ASSOC
);

if ($data) {
    echo json_encode([
        "status" => "success",
        "message" => "Registrasi berhasil",
        "npk" => $data["npk"],
        "passwordHash" => $data["passwordHash"]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "INSERT dijalankan tetapi data tidak ditemukan"
    ]);
}

sqlsrv_free_stmt($stmt_check);
sqlsrv_free_stmt($stmt_insert);
sqlsrv_free_stmt($stmt_verify);
sqlsrv_close($conn);
}
?>