function tegur(){
    let  inputElemen = document.getElementById("YouName");
    let  nama = inputElemen.value.trim();

    if (nama === ""){
        alert("Mohon diisi terlebih dahulu!");
        return;
    }

    let waktu = new Date().getHours();
    let ucapan;

    if (waktu < 12) {
        ucapan = "Selamat Pagi";
    } else if (waktu < 15) {
        ucapan = "Selamat Siang";
    } else if (waktu < 18) {
        ucapan = "Selamat Sore";
    } else {
        ucapan = "Selamat Malam";
    }

    let pesan = ucapan + ", " + nama +"! Selamat Datang.";

    alert(pesan);
    document.getElementById("hasil").innerText = nama ;
    inputElemen.value ="";
}

function darkMode(){
    document.body.classList.toggle("dark");

    let button = document.getElementById("themeButton");

    if (document.body.classList.contains("dark")) {
        button.innerText = "☀️ Light Mode";
    } else {
        button.innerText = "🌙 Dark Mode"
    }
    /*let button = document.querySelector("button[onclick='darkMode()']");
    button.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";*/
}

function resetForm(){
    document.getElementById("YouName").value = "";
    document.getElementById("hasil").innerText = "";
}