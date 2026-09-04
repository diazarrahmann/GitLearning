<?php

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST"){
    echo json_encode ([
        "status" => "error",
        "message" => "Metode akses ditolak."
    ]);

    exit;
}

//mengambil data dari form
$npk_input = trim($_POST['npk_user'] ?? '');
$new_password = $_POST['password_baru'] ?? '';
$confirm_password = $_POST['konfirmasi_password'] ?? '';

//validasi inputan
if ($npk_input === '' || $new_password === '' || $confirm_password === '') {
    echo json_encode (["status" => "error", "message" => "Semua field wajib diisi."]);
    exit;
}

if (strlen($npk_input) !== 7) {
    echo json_encode (["status" => "error", "message" => "NPK harus berisi dari 7 karakter."]);
    exit;
}

if ($new_password !== $confirm_password){
    echo json_encode (["status" => "failed", "message" => "Konfirmasi password tidak sesuai."]);
    exit;
}

if (strlen($new_password) < 8) {
    echo json_encode (["status" => "error", "message" => "Password minimal 8 karakter"]);
    exit;
}

//hash password baru
$new_password_hash = hash('sha256', $new_password);

//koneksi sql
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
    echo json_encode (["status" => "error", "message" => "koneksi ke database gagal", "details" => sqlsrv_errors()]);
    exit;
}

$sql_check = "SELECT npk FROM dbo.login WHERE npk = ?";
$params_check = [$npk_input];

$stmt_check = sqlsrv_query($conn, $sql_check, $params_check);

if ($stmt_check === false) {
    echo json_encode (["status" => "error", "message" => "Gagal memeriksa NPK", "details" => sqlsrv_errors()]);

    sqlsrv_close($conn);
    exit;
}

$user_exists = sqlsrv_fetch_array($stmt_check, SQLSRV_FETCH_ASSOC);

//npk tidak di temukan
if (!$user_exists) {
    echo json_encode (["status" => "error", "message" => "NPK tidak di temukan"]);

    sqlsrv_free_stmt($stmt_check);
    sqlsrv_close($conn);
    exit;
}

sqlsrv_free_stmt($stmt_check);

//update password
$sql_update = "UPDATE dbo.login SET passwordHash = ? WHERE npk = ?";
$params_update = [$new_password_hash, $npk_input];
$stmt_update = sqlsrv_query($conn, $sql_update, $params_update);

//cek update
if ($stmt_update === false) {
    echo json_encode (["status" => "error", "message" => "Gagal mengubah password", "details" => sqlsrv_errors()]);

    sqlsrv_close($conn);
    exit;
}

// berhasil
echo json_encode (["status" => "success", "message" => "Password berhasil diubah"]);

sqlsrv_free_stmt($stmt_update);
sqlsrv_close($conn);

?>


