let username = document.getElementById("username")
let email = document.getElementById("email")
let password = document.getElementById("password")
let btn = document.getElementById("btn")
let msg = document.getElementById("msg")

// Redirect logged-in users away from register page
if (localStorage.getItem("login_user") != null) {
    location.replace("index.html"); // already logged in, go to home
}

async function register(){

     let data = await fetch("http://localhost:4000/users?email="+email.value)
     let jsonData = await data.json()
    
    if(jsonData.length>0){
     msg.textContent = "User already exists!"
     msg.style.color = "red"
     return
    }

    let res = await fetch("http://localhost:4000/users",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            username:username.value,
            email:email.value,
            password:password.value
        })
    })
    location.replace("login.html")
}


btn.onclick = function(event){
    event.preventDefault()
    if(username.value=="" || email.value=="" || password.value==""){
        alert("Please enter all fields")
        return 
    }
    register()
}