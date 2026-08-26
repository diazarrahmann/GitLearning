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

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit",async function(event) {
        event.preventDefault();

        let npk = document.getElementById("npk").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let usernameBenar = "admin";
        let passwordBenar = "jelasKelas12";

        let message = document.getElementById("loginMessage");

        if (username === usernameBenar && password === passwordBenar) {
            message.innerText = "Login Berhasil!";
            message.className = "success";

            let passwordHash = await hashPassword(password);

            sessionStorage.setItem("npk", npk);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", passwordHash);
            
            /*setTimeout(function() {
                window.location.href = "main.html";
            }, 1500);*/
        
        } else {
            message.innerText = "Login Gagal! Username atau Password salah.";
            message.className = "error";
        }

    });
}

function tampilkanUser() {
    let npkUser = sessionStorage.getItem("npk");
    let usernameUser = sessionStorage.getItem("username");
    let passwordUser = sessionStorage.getItem("password");

    alert(`
Login berhasil!

NPK: ${npkUser}
Username: ${usernameUser}
Password: ${passwordUser.length}
    `);
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    console.log(data);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    console.log(hashBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    console.log(hashArray);

    const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

        console.log(hashHex);
    return hashHex;
}

/* if (window.location.pathname.endsWith("main.html")) {

let npkUser = sessionStorage.getItem("npk");
let usernameUser = sessionStorage.getItem("username");
let passwordUser = sessionStorage.getItem("password");

/*let userInfo = document.getElementById("userInfo");

    if (userInfo && npkUser && usernameUser && passwordUser) {
    /*userInfo.innerHTML alert (`
    Login Berhasil!

    NPK: ${npkUser}
    Username: ${usernameUser}
    Password: ${passwordUser}
    `);
    }
}*/

