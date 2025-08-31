import { userSavedData } from "./dummy_data.js"

const mainContent = document.getElementById('main-content')
const charactersBtn = document.getElementById('characters-btn')
const copyrightText = document.getElementById('copyright-text')

// listener for button clicks
document.addEventListener('click', function(e){
    
    if(e.target.id === 'characters-btn'){
        console.log("Characters button clicked!")
    }
    else if (e.target.dataset.btn){
        if (!document.getElementById('nav-links').style.display){
            document.getElementById('nav-links').style.display = 'none'
        }
        document.getElementById('nav-links').style.display = 
            document.getElementById('nav-links').style.display === 'none' ? 'flex' : 'none';
    }
})

document.addEventListener('submit', function(e){
    e.preventDefault()
    search()
})

// updates the copyright text to always show the current year
copyrightText.innerText = `Copyright © ${new Date().getFullYear()} Phantom Fox`

// renders out the content in the main section
function renderDefaultState(userData) {
    renderCharacters(userData)
    renderGames(userData)
    renderGreeting(userData)
}

// renders the saved games section
function renderGames(userData) {

    let contentHtml = '<h2>Games</h2>'

     if (userData.games){
        userData.games.forEach(function(game){
            contentHtml += `
                <div class="game">
                    <h3>${game.title}</h3>
                    <p>Date Created: ${game.dateCreated}</p>
                </div>
            `
        })
    }
    else {
        contentHtml += `
            <p>You have no saved games.</p>
        `
    }

    contentHtml +=
        `
        <div>
            <button>Join Game <i class="fa-solid fa-dice-d20"></i></button>
            <button>Create Game <i class="fa-solid fa-plus"></i></button>
        </div>
         `
    document.getElementById('games-container').innerHTML = contentHtml
}

// renders the saved characters section
function renderCharacters(userData) {
    
    let contentHtml = '<h2>Characters</h2>'

    if (userData.characters){
        userData.characters.forEach(function(character){
            contentHtml += `
                <div class="character">
                    <h3>${character.name}</h3>
                    <p>Class: ${character.class}</p>
                </div>
            `
        })
    }
    else {
        contentHtml += `
            <p>You have no saved characters.</p>
        `
    }

    document.getElementById('characters-container').innerHTML = contentHtml
}

function renderGreeting(userData){
    document.getElementById('user-welcome').textContent = `Welcome, ${userData.username}!`
}

renderDefaultState(userSavedData)
