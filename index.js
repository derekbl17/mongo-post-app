"use-strict"
console.log("index.js initiated")

const regLand=document.getElementById("regLand")
const logLand=document.getElementById("logLand")

const landingPage={
    formStatus : "login",
    landButtons : ()=>{
        if(self.formStatus==="login"){
            console.log("Reg form selected")
            document.getElementById("registration-form").style.display="block"
            document.getElementById("login-form").style.display="none"
            regLand.style.display="none"
            logLand.style.display="block"
            self.formStatus="register"
        }else{
            console.log("Login form selected")
            document.getElementById("registration-form").style.display="none"
            document.getElementById("login-form").style.display="block"
            regLand.style.display="block"
            logLand.style.display="none"
            self.formStatus="login"
        }
    },
};

regLand.addEventListener("click",(e)=>{
    e.preventDefault()
    landingPage.landButtons()
});

logLand.addEventListener("click",(e)=>{
    e.preventDefault()
    landingPage.landButtons()
});

landingPage.landButtons() // on page load activate form btn
