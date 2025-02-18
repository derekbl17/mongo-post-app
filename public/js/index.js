"use-strict"
console.log("index.js initiated")

const regSelect=document.getElementById("registerSelect")
const loginSelect=document.getElementById("loginSelect")

const registerForm=document.getElementById("registration-form")
const loginForm=document.getElementById("login-form")

const regSubmit=document.getElementById("regSubmit")
const loginSubmit=document.getElementById("logSubmit")

const showRegistrationForm = () => {
    registerForm.classList.remove('displayNone');
    loginForm.classList.add('displayNone');
    regSelect.classList.add('displayNone');
    loginSelect.classList.remove('displayNone');
};

const showLoginForm = () => {
    registerForm.classList.add('displayNone');
    loginForm.classList.remove('displayNone');
    regSelect.classList.remove('displayNone');
    loginSelect.classList.add('displayNone');
};

const toggleFormState = (() => {
    let currentForm = 'login';
    return () => {
        currentForm = currentForm === 'login' ? 'register' : 'login';
        currentForm === 'register' ? showRegistrationForm() : showLoginForm();
    };
})();

const initializeFormHandlers = () => {
    const buttonContainer = document.getElementById("header");
    const buttonHandlers = {
        'registerSelect': () => toggleFormState(),
        'loginSelect': () => toggleFormState()
    };
    
    buttonContainer.addEventListener("click", (e) => { // add listeners on buttons inside specified container
        const button = e.target.closest('[id]');  // Find closest element with an ID
        if (button && buttonHandlers[button.id]) {
            e.preventDefault();
            buttonHandlers[button.id]();
        }
    });

    showLoginForm();
};
document.addEventListener('DOMContentLoaded', initializeFormHandlers);

// submit registration
registerForm.addEventListener("submit", async(e)=>{
    e.preventDefault()
    console.log("register submit");
    const name=document.getElementById("regName").value
    const email=document.getElementById("regEmail").value
    const password=document.getElementById("regPass").value
    if(name && email && password){
        try{
            const response = await fetch("http://127.0.0.1:999/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password }),
            });
            const result = await response.json();
            console.log(result);
        }catch(error){
            console.error("Registration error: ",error)
        }
    }else{
        alert("Fields cant be blank")
    }
    
})
// submit login
loginForm.addEventListener("submit",async(e)=>{
    e.preventDefault()
    console.log("login submit");
    console.log(document.getElementById("logEmail").value)
    console.log(document.getElementById("logPass").value,"\n")
    const email=document.getElementById("logEmail").value
    const password=document.getElementById("logPass").value
    if(email && password){
        try{
        const response = await fetch("http://127.0.0.1:999/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
        });
        const result = await response.json();
        console.log(result);
        response.ok ? alert(`welcome ${result.name} !`) : alert('Login failed')
        } catch(error){
            console.error("Login error: ",error)
        }
    }else{
        email ? alert("password cant be empty") : alert("email cant be empty")
    }
    
    
})