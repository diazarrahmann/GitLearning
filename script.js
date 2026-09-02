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

/*function resetForm(){
    document.getElementById("YouName").value = "";
    document.getElementById("hasil").innerText = "";
}*/

/* const defaultUsers = [
    {
        npk: "1234567", passwordHash: "06ba33499107fa199d223b4d925ab5706289a514753256b0795fd7da4a962153"
    }];

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers)
    );
}*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const npk = document.getElementById("npk").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");

        try {

            const response = await fetch("backend/proses_login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    npk_user: npk,
                    password_asli: password
                })
            });

            const result = await response.json();

            console.log(result);

            if (result.status === "success") {

                message.innerText = "Login berhasil!";
                message.className = "success";

                sessionStorage.setItem("npk", result.data.npk);

                setTimeout(function() {
                    window.location.href = "main.html";
                }, 1500);

            } else {

                message.innerText = result.message;
                message.className = "error";

            }

        } catch (error) {

            console.error(error);

            message.innerText = "Terjadi kesalahan saat menghubungi server.";
            message.className = "error";

        }
    });
}

/*function tampilkanUser() {
    let npkUser = sessionStorage.getItem("npk");
    let usernameUser = sessionStorage.getItem("username");
    let passwordUser = sessionStorage.getItem("password");

    alert(`
Login berhasil!

NPK: ${npkUser}
Username: ${usernameUser}
Password: ${passwordUser.length}
    `);
}*/

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    //console.log(data);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    //console.log(hashBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    //console.log(hashArray);

    const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

        console.log(hashHex);
    return hashHex;
}

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", function () {

        const icon = button.querySelector("i");

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");

        } else {

            input.type = "password";

            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");

        }

    });

}


// LOGIN
setupPasswordToggle(
    "togglePassword",
    "password"
);


// FORGOT PASSWORD
setupPasswordToggle(
    "toggleNewPassword",
    "newPassword"
);

setupPasswordToggle(
    "toggleConfirmPassword",
    "confirmPassword"
);

const registerForm = document.getElementById("registerForm");

if (registerForm){
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const npk = document.getElementById("npk").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        //mengambil data user
        const users = getUsers();
        console.log(users);

        //cek npk sudah terdaftar
        const existingUser = users.find(function(user){
            return user.npk === npk;
        });

        if (existingUser) {
            message.innerText ="NPK sudah terdaftar";
            message.className ="error";
            return;
        }

        //cek password
        if (password !== confirmPassword) {
            message.innerText ="Konfirmasi password tidak sesuai";
            message.className ="error";
            return;
        }

        //hash ps
        const passwordHash = await hashPassword(password);

        //buat data user baru
        const newUser = {
            npk: npk, name: name, passwordHash: passwordHash
        };
        
        //masukkan user baru
        users.push(newUser);

        //simpan local storage
        saveUsers(users);
        message.innerText = "Registrasi Berhasil!";
        message.className = "success";

        setTimeout(function(){
            window.location.href = "login.html";
        }, 1500);
    });
}

function getUsers(){
    return JSON.parse(
        localStorage.getItem("users")
    ) || [];
}

function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener("submit", async function(event) {
        event.preventDefault();

            const npk = document.getElementById("npk").value.trim();
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const message = document.getElementById("forgotMessage");

            // Ambil data user dari Local Storage
            const users = getUsers();

            // Cari user berdasarkan NPK
            const user = users.find(
                function (user) {
                    return user.npk === npk;
                }
            );


            // NPK tidak ditemukan
            if (!user) {
                message.innerText = "NPK tidak ditemukan.";
                message.className = "error";
                return;
            }


            // Cek password baru
            if (newPassword !== confirmPassword) {
                message.innerText = "Konfirmasi password tidak sesuai.";
                message.className = "error";
                return;
            }

            // Hash password baru
            const newPasswordHash =
                await hashPassword(newPassword);

            // Update password
            user.passwordHash = newPasswordHash;


            // Simpan kembali
            saveUsers(users);

            message.innerText = "Password berhasil diubah!";
            message.className = "success";


            // Kembali ke login
            setTimeout(function() {
                window.location.href = "login.html";
            }, 1500);

        }
    );
}


