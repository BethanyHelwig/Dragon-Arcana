const url = localStorage.getItem("sheeturl")

async function fillSheet(){
    const response = await fetch(`https://www.dnd5eapi.co${url}`)
    const data = await response.json()

    document.getElementById('sheet-body').textContent = data
}

// fillSheet()