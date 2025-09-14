const dicePanel = document.getElementById('dice-panel')
const diceCalculator = document.getElementById('dice-calculator')
const diceSelection = document.getElementById('dice-selection-form')
let diceSelected = 20
let diceRolls = 1

const url = localStorage.getItem("sheeturl")

let abilityScores = {
    DEX: { mod: 0, save: 0},
    STR: { mod: 0, save: 0},
    INT: { mod: 0, save: 0},
    WIS: { mod: 0, save: 0},
    CON: { mod: 0, save: 0},
    CHA: { mod: 0, save: 0}
}

let healthData = ''

document.addEventListener('click', (e) => {
    if (e.target.id === 'roll-stats'){
        const health = rollForHealth()
        renderHP(health)
    }
    else if (e.target.id === 'dice-button' || e.target.id === 'dice-panel-icon'){
        togglePanel()
    }
    else if (e.target.id === 'roll-dice'){
        rollDice()
    }
    else if (e.target.id === 'health-minus'){
        updateHealth(-document.getElementById('health-change-input').value)
    }
    else if (e.target.id === 'health-plus'){
        updateHealth(document.getElementById('health-change-input').value)
    }
})

diceSelection.addEventListener('change', (e) => {
    if (e.target.name === 'dice'){
        diceSelected = e.target.value
    }
    else if (e.target.name === 'roll-number'){
        diceRolls = e.target.value
    }
    renderDiceEquation()
})

async function fillSheet(){
    const response = await fetch(`https://www.dnd5eapi.co${url}`)
    const data = await response.json()

    const string = buildString(data)

    document.getElementById('sheet-body').innerHTML = string

    document.getElementById('dice-selection-fieldset').value = 20
    document.getElementById('dice-rolls-fieldset').value = 1
}

function buildString(data){

    healthData = data.hit_points_roll
    console.log(healthData)
    const skills = parseSkills(data.proficiencies)
    const immunities = data.damage_immunities.join(", ")

    let senses = []
    for (var key in data.senses){
        if (data.senses.hasOwnProperty(key)){
            senses.push(`${key} ${data.senses[key]}`)
        }
    }
    const sensesString = senses.join(", ")

    const traits = parseTraits(data.special_abilities)
    const actions = parseTraits(data.actions)
    const legendaryActions = parseTraits(data.legendary_actions)
    const abilityScores = calculateModsAndSaves(data)

    let speed = ''
    if (data.speed.walk) {
        speed += `${data.speed.walk}`
    }
    if (data.speed.fly) {
        speed += `, Fly ${data.speed.fly}`
    }
    if (data.speed.swim) {
        speed += `, Swim ${data.speed.swim}`
    }

    const string = `
        <img id="sheet-img" src="https://www.dnd5eapi.co${data.image}">
        <div class="sheet-top">
            <h1 id="ms-title">${data.name}</h1>
            <h4 id="ms-subtitle">${data.size} ${data.type}, ${data.alignment}</h4>
        </div>
        <div class="flex-between">
            <div>
                <p><span class="score-title"><i class="fa-solid fa-shield"></i> AC</span> ${data.armor_class[0].value}</p>
                <div id="hp-container">
                    <p><span class="score-title"><i class="fa-solid fa-heart"></i> HP</span> <span class="hp">(${data.hit_points_roll})</span> </p> <button id="roll-stats">Roll for HP</button>
                </div>
                <p><span class="score-title">Initiative</span> N/A</p>
                <p><span class="score-title">Proficiency</span> +${data.proficiency_bonus}</p>
                <p><span class="score-title">Speed</span> ${speed}</p>
            </div>
            <div id="interactive-scores">
                <div id="health-calculator">
                    <h3>HEALTH</h3>
                    <p class="hp" id="hp">(${data.hit_points_roll})</p>
                    <div class="flex">
                        <button id="health-minus">-</button>
                        <input id="health-change-input" type="number" pattern="[0-9]{1,2}">
                        <button id="health-plus">+</button>
                    </div>
                </div>
            
            </div>
        </div>
        <h2>Ability Scores</h2>
        ${abilityScores}
        <p><span class="score-title">Skills</span> ${skills}</p>
        <p><span class="score-title">Immunities</span> <span class="capitalize">${immunities}</span></p>
        <p><span class="score-title">Senses</span> <span class="capitalize">${sensesString}</span></p>
        <p><span class="score-title">Languages</span> ${data.languages}</p>
        <p><span class="score-title">Challenge Rating</span> ${data.challenge_rating}</p>
        <h2>Traits</h2>
        ${traits}
        <h2>Actions</h2>
        ${actions}
        <h2>Legendary Actions</h2>
        ${legendaryActions}
    `

    return string;
}

function parseSkills(skills){

    let string = []

    skills.forEach(skill => {
        if (skill.proficiency.name.startsWith("Skill: ", 0)){
            string.push(`${skill.proficiency.name.substring(7)} +${skill.value}`)
        }
    })

    return string.join(", ")
}

function parseTraits(traits){
    let string = ''
    traits.forEach(trait => {
        string += `
        <p><span class="score-title">${trait.name}.</span> ${trait.desc}</p>
        `
    })

    return string
}

function calculateModsAndSaves(data){
    
    abilityScores['STR'].mod = calculateModifier(data.strength)
    abilityScores['STR'].save = calculateModifier(data.strength)
    abilityScores['INT'].mod = calculateModifier(data.intelligence)
    abilityScores['INT'].save = calculateModifier(data.intelligence)
    abilityScores['DEX'].mod = calculateModifier(data.dexterity)
    abilityScores['DEX'].save = calculateModifier(data.dexterity)
    abilityScores['WIS'].mod = calculateModifier(data.wisdom)
    abilityScores['WIS'].save = calculateModifier(data.wisdom)
    abilityScores['CON'].mod = calculateModifier(data.constitution)
    abilityScores['CON'].save = calculateModifier(data.constitution)
    abilityScores['CHA'].mod = calculateModifier(data.charisma)
    abilityScores['CHA'].save = calculateModifier(data.charisma)

    data.proficiencies.forEach(obj => {
        if (obj.proficiency.name.startsWith("Saving Throw: ")){
            const score = obj.proficiency.name.split(" ").pop()
            abilityScores[score].save = obj.value
        }
    })

    const string = `
        <ul>
            <li class="ability">
                <h3>Strength</h3>
                <p>${data.strength}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${abilityScores['STR'].mod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${abilityScores['STR'].save}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Intelligence</h3>
                <p>${data.intelligence}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${abilityScores['INT'].mod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${abilityScores['INT'].save}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Dexterity</h3>
                <p>${data.dexterity}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${abilityScores['DEX'].mod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${abilityScores['DEX'].save}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Wisdom</h3>
                <p>${data.wisdom}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${abilityScores['WIS'].mod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${abilityScores['WIS'].save}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Constitution</h3>
                <p>${data.constitution}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${abilityScores['CON'].mod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${abilityScores['CON'].save}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Charisma</h3>
                <p>${data.charisma}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${abilityScores['CHA'].mod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${abilityScores['CHA'].save}</p>
                    </div>
                </div>
            </li>
        </ul>`

    return string
}

function calculateModifier(score){
    return Math.floor((score - 10) / 2)
}

function rollForHealth(){
    const rollNumber = parseInt(healthData.split("d").shift())
    let dice = 0
    let additive = 0
    let total = 0

    const remainder = healthData.split("d")
    if (healthData.includes("+")){
        dice = parseInt(remainder[1].split("+").shift())
        additive = parseInt(remainder[1].split("+").pop())
    }

    for (let i = rollNumber; i > 0; i--){
        total += Math.round(Math.random() * dice)
    }

    return total + additive

}

function renderHP(health){

    const hpList = document.querySelectorAll('.hp')
    hpList.forEach((el) => el.textContent = ` ${health}`)
    document.getElementById('roll-stats').textContent = `Reroll HP (${healthData})`

}

function togglePanel(){
    if (dicePanel.style.display === 'none' || dicePanel.style.display === '') {
        dicePanel.style.display = 'flex';
    } else {
        dicePanel.style.display = 'none';
    }
}

function renderDiceEquation(){
    diceCalculator.innerHTML = `Roll d${diceSelected} x ${diceRolls}: `
}

function rollDice(){
    renderDiceEquation()
    let totals = []
    for (let i = 0; i < diceRolls; i++){
        console.log(`Current dice selected is: ${diceSelected}`)
        let subtotal = Math.round(Math.random() * (diceSelected - 1) + 1);
        console.log(`Subtotal rolled is: ${subtotal}`)
        totals.push(subtotal)
    }
    console.log(totals)
    const sum = totals.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let string = `<p>(${totals.join(" + ")}) = ${sum}</p>`

    diceCalculator.innerHTML += string
}

function updateHealth(change){
    let currentHP = parseInt(document.getElementById('hp').textContent)
    currentHP += parseInt(change)
    document.getElementById('hp').textContent = currentHP
}

fillSheet()
renderDiceEquation()