"use-strict"
console.log("index.js initiated")

const landingPage={
    regHeadButton : ()=>{
        console.log("Reg form selected")
    },
    logHeadButton : ()=>{
        console.log("Login form selected")
    }
};

document.getElementById("regLand").addEventListener("click",(e)=>{
    e.preventDefault()
    landingPage.regHeadButton()
});

document.getElementById("logLand").addEventListener("click",(e)=>{
    e.preventDefault()
    landingPage.logHeadButton()
})
    