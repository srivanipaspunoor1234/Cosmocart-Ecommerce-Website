let email = document.getElementById("email")
let password = document.getElementById("password")
let btn = document.getElementById("btn")

if(localStorage.getItem("login_user")!=null){
        location.replace("index.html")
    }

async function login() {
    let res = await fetch("http://localhost:4000/users?email=" + email.value)
    let jsonRes = await res.json()

    if (jsonRes.length == 0) {
        msg.textContent = "User does not exists!"
        msg.style.color = "red"
    } else {
        if (jsonRes[0].password == password.value) {
            localStorage.setItem("login_user", email.value)
            location.replace("index.html")
        } else {
            msg.textContent = "Invalid credentials!"
            msg.style.color = "red"
        }
    }
}


btn.onclick = function (event) {
    if (email.value == "" || password.value == "") {
        alert("Please enter all fields")
        return
    }
    event.preventDefault()
    login()
}