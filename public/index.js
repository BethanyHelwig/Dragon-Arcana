const enterBtn = document.getElementById('enter-btn')
const loginContainer = document.getElementById('login-container')

enterBtn.addEventListener('click', displayLogin)

function displayLogin(){
    enterBtn.style.display = 'none'
    loginContainer.style.display = 'flex'
}