
const searchResultsContainer = document.getElementById('search-results')

document.addEventListener('submit', function(e) {
    e.preventDefault()
    search()
})

document.addEventListener('click', function(e) {
    if (e.target.dataset.url){
        getDetails(e.target.dataset.url, e.target.parentElement.id, e.target.dataset.category)
    }
    else if (e.target.dataset.sheeturl){
        console.log("Character sheet button pressed!")
        localStorage.setItem("sheeturl", e.target.dataset.sheeturl)
        window.open("monstersheet.html", "_blank")
    }
})

function search(){
    const searchTerm = document.getElementById('dnd-search').value
    const searchCategory = document.getElementById('search-dropdown').value
    console.log(searchTerm)
    console.log(searchCategory)
    
    fetch(`https://www.dnd5eapi.co/api/2014/${searchCategory}/?name=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.count === 0){
                searchResultsContainer.innerHTML = `
                    <p>No results.</p>
                `
            }
            else {
                searchResultsContainer.innerHTML = `
                    <p>**Click on results to expand details**</p>
                    <h2>${searchCategory}</h2>
                `
                data.results.forEach(result => {
                    searchResultsContainer.innerHTML += `
                        <div class="search-result-item" id="${result.index}">
                            <h3 data-url="${result.url}" data-category="${searchCategory}">${result.name}</h3>
                        </div>
                    `
                })
            }
        })
        .catch (err => console.error(err))
    
}

async function getDetails(url, id, category) {
    const response = await fetch(`https://www.dnd5eapi.co${url}`)
    const data = await response.json()

    console.log(data)
    if (category === "monsters") {
        
        const actions = data.actions.length > 0 
            ? data.actions.map( action => action.name).join(", ") : "n/a"

        document.getElementById(id).innerHTML += `
            <div class="search-result-content">
                <img src="https://www.dnd5eapi.co${data.image}" alt="Image of ${data.name}">
                <ul>
                    <li>Type: <span class="emphasis">${data.type}</span></li>
                    <li>Alignment: <span class="emphasis">${data.alignment}</span></li>
                    <li>Challenge Rating: <span class="emphasis">${data.challenge_rating}</span></li>
                    <li>XP: <span class="emphasis">${data.xp}</span></li>
                    <li>Ability Scores:
                        <ul>
                            <li>Charisma: <span class="emphasis">${data.charisma}</span></li>
                            <li>Constitution: <span class="emphasis">${data.constitution}</span></li>
                            <li>Dexterity: <span class="emphasis">${data.dexterity}</span></li>
                            <li>Intelligence: <span class="emphasis">${data.intelligence}</span></li>
                            <li>Strength: <span class="emphasis">${data.strength}</span></li>
                            <li>Wisdom: <span class="emphasis">${data.wisdom}</span></li>
                        </ul>
                    </li>
                    <li>Hit Points: <span class="emphasis">${data.hit_points} (${data.hit_points_roll})</span></li>
                    <li>Hit Dice: <span class="emphasis">${data.hit_dice}</span></li>
                    <li>Armor Class: <span class="emphasis">${data.armor_class[0].value} (${data.armor_class[0].type})</span></li>
                    <li>Actions: <span class="emphasis">${actions}</span></li>
                </ul>
            </div>
            <button data-sheeturl="${url}">Generate full character sheet</button>
        `
    }
}