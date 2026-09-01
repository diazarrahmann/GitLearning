<?php

$serverName = "MSI\SQLEXPRESS";

$connectionOptions = [
    "Database" => "gitLearning",
    "Uid" => "zaid",
    "PWD" => "akukamu"
];

$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    echo "Koneksi gagal<br>";
    die(print_r(sqlsrv_errors(), true));
}

echo "Koneksi SQL Server berhasil!";

?>