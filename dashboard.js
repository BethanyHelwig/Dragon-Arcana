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
        <h1>Welcome, adventurer!</h1>

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
            </section>

            <!-- WORLD OF D&D -->
            <section class="main-content-section gradient-border" aria-label="World of D&D">
                <h2>World of D&D</h2>
            </section>
        </div>
        `

    mainContent.innerHTML = contentHtml

}

renderDefaultState(userSavedData)
