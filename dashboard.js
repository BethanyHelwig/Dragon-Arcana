import { userSavedData } from "./dummy_data.js"

const mainContent = document.getElementById('main-content')
const charactersBtn = document.getElementById('characters-btn')

document.addEventListener('click', function(e){
    if(e.target.id === 'characters-btn'){
        console.log("Characters button clicked!")
    }
})

function renderDefaultState(userData) {

    let contentHtml = `
        <h1>Welcome, ${userData.username}!</h1>

        <div class="flex">
            <!-- CHARACTERS -->
            <section class="main-content-section gradient-border" aria-label="Characters">
                <h2>Characters</h2>
        `

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

    contentHtml +=
        `
            </section>

            <!-- GAMES -->
            <section class="main-content-section gradient-border" aria-label="Games">
                <h2>Games</h2>
        `

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
            </section>

            <!-- WORLD OF D&D -->
            <section class="main-content-section gradient-border" aria-label="World of D&D">
                <h2>World of D&D</h2>
                <form>
                    <label for="dnd-search">Search D&D Database:</label>
                    <input type="search" id="dnd-search" placeholder="What are you looking for?">
                    <button type="submit">Go!</button>
                </form>
            </section>
        </div>
        `

    mainContent.innerHTML = contentHtml

    console.log(contentHtml)

}

renderDefaultState(userSavedData)
