function addPokemon(pokemonName, pokemonSpecies, pokemonId, pokemonImg) {
  const pokeLi = document.createElement('li')
  const pokeImg = document.createElement('img')
  const pokeDiv = document.createElement('div')
  const capitalSpecies = pokemonSpecies.charAt(0).toUpperCase() + pokemonSpecies.slice(1)

  pokeLi.innerHTML = `${pokemonName} - ${capitalSpecies}`
  pokeLi.dataset.species = pokemonSpecies
  pokeLi.dataset.id = pokemonId

  pokeImg.src = pokemonImg

  pokeDiv.classList = 'container'

  pokeDiv.append(pokeLi)
  pokeDiv.append(pokeImg)
  leftColumn.querySelector('#pokemon-ul').append(pokeDiv)
}

function addItem(item) {
  if(leftColumn.querySelector(`#${item.api_id}-amount`)){
    const currentAmount = leftColumn.querySelector(`#${item.api_id}-amount`).innerText.slice(1)
    leftColumn.querySelector(`#${item.api_id}-amount`).innerText = 'x' + (parseInt(currentAmount) + 1)
  }else{
    const newLi = document.createElement('li')
    newLi.id = item.api_id
    newLi.dataset.dbId = item.id
    newLi.innerHTML = `<img src="${item.img_url}" class="inventory-sprite"> ${item.name} <span id="${item.api_id}-amount">x${item.amount}</span>`
    leftColumn.querySelector('#inventory-ul').append(newLi)
  }
}

function removeItem(itemEl) {
  const currentAmount = itemEl.querySelector('span').innerText.slice(1)
  itemEl.querySelector('span').innerText = 'x' + (parseInt(currentAmount) - 1)
  if(itemEl.querySelector('span').innerText.slice(1) == '0'){itemEl.remove()}
  deleteItem(itemEl.id, logoImg.dataset.currentUser)
}

function addHP(healAmount) {
  const hpEl = leftColumn.querySelector('#hp-p')
  const currentHP = hpEl.innerText

  if(parseInt(currentHP) + healAmount > 100){
    hpEl.innerText = 100
  }else{
    hpEl.innerText = parseInt(currentHP) + healAmount
  }

  patchHP(parseInt(hpEl.innerText), logoImg.dataset.currentUser)
}

function updateHP(damage) {
  const currentHP = leftColumn.querySelector('#hp-p').innerText
  leftColumn.querySelector('#hp-p').innerText = parseInt(currentHP) - damage
}