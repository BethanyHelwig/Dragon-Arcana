const url = localStorage.getItem("sheeturl")
let dexMod = 0
let dexSave = 0
let strMod = 0
let strSave = 0
let intMod = 0
let intSave = 0
let wisMod = 0
let wisSave = 0
let conMod = 0
let conSave = 0
let chaMod = 0
let chaSave = 0

async function fillSheet(){
    const response = await fetch(`https://www.dnd5eapi.co${url}`)
    const data = await response.json()

    const string = buildString(data)

    document.getElementById('sheet-body').innerHTML = string
}

function buildString(data){

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
        <h1 id="ms-title">${data.name}</h1>
        <h4 id="ms-subtitle">${data.size} ${data.type}, ${data.alignment}</h4>
        <button>Roll Random Stats</button>
        <p><span class="score-title"><i class="fa-solid fa-shield"></i> AC</span> ${data.armor_class[0].value}</p>
        <p><span class="score-title"><i class="fa-solid fa-heart"></i> HP</span> ${data.hit_points} (${data.hit_points_roll})</p>
        <p><span class="score-title">Initiative</span> N/A</p>
        <p><span class="score-title">Proficiency</span> +${data.proficiency_bonus}</p>
        <p><span class="score-title">Speed</span> ${speed}</p>
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
    
    strMod = calculateModifier(data.strength)
    strSave = calculateModifier(data.strength)
    intMod = calculateModifier(data.intelligence)
    intSave = calculateModifier(data.intelligence)
    dexMod = calculateModifier(data.dexterity)
    dexSave = calculateModifier(data.dexterity)
    wisMod = calculateModifier(data.wisdom)
    wisSave = calculateModifier(data.wisdom)
    conMod = calculateModifier(data.constitution)
    conSave = calculateModifier(data.constitution)
    chaMod = calculateModifier(data.charisma)
    chaSave = calculateModifier(data.charisma)

    data.proficiencies.forEach(obj => {
        if (obj.proficiency.name.startsWith("Saving Throw: ", 0)){
            const score = obj.proficiency.name.substring(14)
            
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
                        <p>${strMod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${strSave}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Intelligence</h3>
                <p>${data.intelligence}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${intMod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${intSave}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Dexterity</h3>
                <p>${data.dexterity}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${dexMod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${dexSave}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Wisdom</h3>
                <p>${data.wisdom}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${wisMod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${wisSave}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Constitution</h3>
                <p>${data.constitution}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${conMod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${conSave}</p>
                    </div>
                </div>
            </li>
            <li class="ability">
                <h3>Charisma</h3>
                <p>${data.charisma}</p>
                <div class="mod-save">
                    <div>
                        <h3>MOD</h3>
                        <p>${chaMod}</p>
                    </div>
                    <div>
                        <h3>Save</h3>
                        <p>${chaSave}</p>
                    </div>
                </div>
            </li>
        </ul>`

    return string
}

function calculateModifier(score){
    return Math.floor((score - 10) / 2)
}

fillSheet()