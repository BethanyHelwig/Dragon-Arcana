const registerContainer = document.getElementById('register-container')
const loginContainer = document.getElementById('login-container')

document.addEventListener('click', (e) => {
    if (e.target.id === 'login-form-btn'){
        displayLogin()
    }
    else if (e.target.id === 'register-form-btn'){
        displayRegister()
    }
})

function displayLogin(){
    loginContainer.style.display = 'flex'
    registerContainer.style.display = 'none'
}

function displayRegister(){
    loginContainer.style.display = 'none'
    registerContainer.style.display = 'flex'
}