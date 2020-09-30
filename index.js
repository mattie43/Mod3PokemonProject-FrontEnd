// Global Variables -------------------------------------------------------------------------------------------------------------------------------------------------

const centerColumn = document.querySelector('.center-column')
const leftColumn = document.querySelector('.left-column')
const scoreboard = document.querySelector('#scoreboard-ol')
const logoImg = document.querySelector('.logo-img')
const baseurl = "http://localhost:3000/"
const locationNames = {
  1: 'Viridan Forest',
  2: ''
}

// Helper functions------------------------------------------------

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const arrayFromHTMLcollection = (HTMLcoll) => {
  new_array = []
  for (const e of HTMLcoll) {
    new_array.push((e.innerHTML).toLowerCase())
  }
  return new_array
}

function between(x, min, max) {
  return x >= min && x <= max
}

// Event Listeners --------------------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('keydown', e => {
  if(leftColumn.innerText != 'Log in first!' && e.key.slice(0, 5) == 'Arrow'){
    moveLocation(e.key.slice(5))
  }
})

leftColumn.addEventListener('click', e => {
  if(e.target.id == 'hpup-li'){
    removeHpUp()
  }else if(centerColumn.querySelector('#location-img').dataset.species && e.target.id.slice(-4) == 'ball'){
    if(e.target.querySelector('span').innerText.slice(1) == '0'){
      centerColumn.querySelector('#message').innerText = "You don't have anymore of those Poké Balls to try and capture it with!"
    }else{
      const pokemonEl = centerColumn.querySelector('#location-img')
      removeItem(e.target)
      centerColumn.querySelector('#message').innerText = `You successfully caught ${pokemonEl.dataset.species}!`
      showRenameForm(pokemonEl.dataset.species, pokemonEl.dataset.id)
    }
  }else if(e.target.id.slice(0,2) == 'hp' || e.target.id.slice(0,6) == 'health'){
    if(leftColumn.querySelector('#hp-p').innerHTML = `${logoImg.data}`){
      centerColumn.querySelector('#message').innerText = 'You are already at full HP!'
    }else{
      addHP(e.target)
      removeItem(e.target)
    }
  }
})

centerColumn.addEventListener('submit', e => {
  e.preventDefault()
  
  if(e.target.className == 'login-form'){
    if(nameExists(e.target.username.value)){
      userLogin(e.target.username.value, true)
      showCurrentLocation()
    }else{
      userLogin(e.target.username.value)
      chooseStartingPokemon()
    }
  }else if(e.target.id == 'starter-form'){
    newPlayerStart()
    postPokemon(e.target.name.value, e.target.dataset.species, e.target.dataset.id, logoImg.dataset.currentUser)
  }else if(e.target.id == 'rename-form'){
    postPokemon(e.target.name.value, e.target.dataset.species, e.target.dataset.id, logoImg.dataset.currentUser)
    showCurrentLocation()
    e.target.remove()
  }
})

centerColumn.addEventListener('click', e => {
  // choosing starter pokemon
  if(e.target.className == 'pokemon-sprites'){
    showRenameForm(e.target.dataset.species, e.target.dataset.id)
  }
})

// Global Functions -------------------------------------------------------------------------------------------------------------------------------------------------

function newPlayerStart() {
  const locationP = leftColumn.querySelector('#location-p')
  locationP.innerText = 'Pallet Town Center'
  locationP.dataset.location = 13
  centerColumn.innerHTML = `
    <img id="location-img" src="./images/locations/img_13.png">
    <p id="message">Welcome to Pallet Town! You can search for Pokémon to collect, but first you need to find some Poké Balls! Professor Oak has given you one to start with. He also said it's dangerous out there, so take an HP-UP as well!</p>
    `

  leftColumn.querySelector('#hp-p').innerText = 100

  postItem(4, logoImg.dataset.currentUser, 'starter')
  postItem(45, logoImg.dataset.currentUser, 'starter')
}

function playerContinue(user) {
  const locationP = leftColumn.querySelector('#location-p')
  locationP.innerText = 'Pallet Town Center'
  locationP.dataset.location = 13
  centerColumn.innerHTML = `
    <img id="location-img" src="./images/locations/img_13.png">
    <p id="message">Welcome back to Pallet Town!</p>
    `

  leftColumn.querySelector('#hp-p').innerText = user.current_hp

  for (const item of user.items) {
    addItem(item)
  }

  for (const pokemon of user.pokemons) {
    addPokemon(pokemon.name, pokemon.species, pokemon.id, pokemon.img_url)
  }
}

// Left Column Functions -------------------------------------------------------------------------------------------------------------------------------------------------

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
  deleteItem(itemEl.id)
}

function addHP(itemEl) {
  let healAmount = 50
  if(itemEl.id.slice(0,2) == 'hp'){healAmount = 20}

  const hpEl = leftColumn.querySelector('#hp-p')
  const currentHP = hpEl.innerText

  if(parseInt(currentHP) + healAmount > 100){
    hpEl.innerText = 100
  }else{
    hpEl.innerText = parseInt(currentHP) + healAmount
  }

  patchHP(hpEl.innerText)
}

function updateHP(damage) {
  const currentHP = leftColumn.querySelector('#hp-p').innerText
  leftColumn.querySelector('#hp-p').innerText = parseInt(currentHP) - damage
  failedMessage(`You tripped and fell! You took ${damage} damage!`)
}

// Center Column Functions -------------------------------------------------------------------------------------------------------------------------------------------------

function showRenameForm(pokemonSpecies, pokemonId) {
  if(centerColumn.querySelector('#starter-form')){
    centerColumn.querySelector('#starter-form').className = ''
  }else{
    centerColumn.querySelector('#rename-form').className = ''
  }
  const renameLabel = centerColumn.querySelector('#rename-label')
  renameLabel.innerText = `What would you like to name ${pokemonSpecies}?`
  renameLabel.parentNode.parentNode.dataset.species = pokemonSpecies
  renameLabel.parentNode.parentNode.dataset.id = pokemonId
}

function createRenameForm(starter) {
  const form = document.createElement('form')
  if(starter){
    form.id = 'starter-form'
  }else{
    form.id = 'rename-form'
  }
  form.classList = 'close'
  form.innerHTML = `
    <div class="form-group">
      <label id="rename-label" for="name"></label>
      <input type="name" class="form-control" id="name" >
    </div>
    <button type="submit" class="btn btn-primary btn-md" value="Submit">Submit</button>
    `
  centerColumn.insertBefore(form, centerColumn.lastElementChild)
}

function chooseStartingPokemon() {
  centerColumn.innerHTML = `
    <div class="container">
      <img class="pokemon-sprites" data-species="Pikachu" data-id="25" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png">
      <img class="pokemon-sprites" data-species="Bulbasaur" data-id="1" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
    </div>
    <div class="container">
      <img class="pokemon-sprites" data-species="Charmander" data-id="4" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png">
      <img class="pokemon-sprites" data-species="Squirtle" data-id="7" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png">
    </div>
    <p id="message">Please select your starting Pokemon!</p>
    `
  createRenameForm('starter')
}

function showCurrentLocation() {
  const locationId = leftColumn.querySelector('#location-p').dataset.location
  if(centerColumn.querySelector('#location-img')){
    const locationImg = centerColumn.querySelector('#location-img')
    locationImg.removeAttribute("data-id")
    locationImg.removeAttribute("data-species")
    locationImg.src = `./images/locations/img_${locationId}.png`
  }
}

function moveLocation(direction) {
  // move around the grid
  const locationP = leftColumn.querySelector('#location-p')  

  const valid = validMove(locationP.dataset.location, direction)
  if(valid == false){
    failedMessage('That is not a valid move, try another direction!')
    return
  }else if(valid == 'victory'){
    failedMessage("You're not ready to head down Victroy Road!")
    return
  }else if(valid == 'north'){
    failedMessage("You're not allowed in that city!")
    return
  }

  let num = 0
  if(direction == 'Left'){
    num = -1
  }else if(direction == 'Right'){
    num = 1
  }else if(direction == 'Up'){
    num = -5
  }else if(direction == 'Down'){
    num = 5
  }  

  locationP.dataset.location = parseInt(locationP.dataset.location) + num
  centerColumn.querySelector('#location-img').src = `./images/locations/img_${locationP.dataset.location}.png`

  encounterCheck()
}

function failedMessage(message) {
  centerColumn.querySelector('#message').innerText = message
}

function encounterCheck() {
  const num = Math.floor(Math.random()*100)+1
  const currentUser = logoImg.dataset.currentUser
  if(between(num, 1, 15)){
    getRandomPokemon()
<<<<<<< HEAD
  }else if(between(num, 10, 11)){
    postItem(1, currentUser)
=======
  }else if(between(num, 16, 17)){
    postItem('master-ball', currentUser)
>>>>>>> b30fd0d9d581af08b9545130a417ac95094d8058
  }else if(between(num, 20, 29)){
    postItem(4, currentUser)
  }else if(between(num, 30, 35)){
    postItem(2, currentUser)
  }else if(between(num, 40, 49)){
<<<<<<< HEAD
    postItem(45, currentUser)
  }else if(between(num, 50, 53)){
    postItem(26, currentUser)
    // add take damage encounter
=======
    postItem('hp-up', currentUser)
  }else if(between(num, 50, 51)){
    postItem('health-wing', currentUser)
  }else if(between(num, 52, 80)){
    patchHP(15, currentUser)
    updateHP(15)
  }else if(between(num, 81, 90)){
    patchHP(40, currentUser)
    updateHP(40)
>>>>>>> b30fd0d9d581af08b9545130a417ac95094d8058
  }else{
    failedMessage("You didn't find anything of use here. Try exploring more!")
  }
}

function pokemonEncounter(pokemon) {
  const capitalName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  centerColumn.querySelector('#message').innerText = `You found ${capitalName}! Try and capture it with one of your Poké Balls, or run away!`

  const locationImg = centerColumn.querySelector('#location-img')
  locationImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  locationImg.dataset.id = pokemon.id
  locationImg.dataset.species = capitalName

  createRenameForm()
}

function displayItem(itemName) {
  centerColumn.querySelector('#message').innerText = `You found a ${itemName}! Let's add it to your inventory!`
}

// Right Column Functions -------------------------------------------------------------------------------------------------------------------------------------------------

const renderNewUser = (user) => {
  const userLi = document.createElement("li")
  userLi.id = user.id
  userLi.dataset.name = user.name
  userLi.dataset.maxHp = user.max_hp
  userLi.dataset.currentHp = user.current_hp
  userLi.innerHTML = `${capitalize(user.name)} | <strong>${user.score}</strong>`
  scoreboard.append(userLi)
}

function nameExists(username) {
  const nameList = scoreboard.querySelectorAll('li')
  for (const name of nameList) {
    if(name.dataset.name == username){return true}
  }
  return false
}

// Fetch requests ---------------------------------------------------------------------------------------------------------------------------------------------------------

<<<<<<< HEAD
const updateHP = (hpAmount) => {
  let options = {
      method: "PATCH",
      headers: {"content-type": "application/json",
                "accept": "applicatio/json" },
      body: JSON.stringify({current_hp: hpAmount})
      }

    fetch(baseurl + `users/${logoImg.dataset.currentUser}`, options)
}

const postItem = (apiId, userId, starter) => {
  let options = {
      method: "POST",
      headers: {"content-type": "application/json",
                "accept": "applicatio/json" },
      body: JSON.stringify({api_id: apiId,
=======
const postItem = (itemName, userId, starter) => {
  let options = {
      method: "POST",
      headers: {"content-type": "application/json",
                "accept": "application/json" },
      body: JSON.stringify({api_id: itemName,
>>>>>>> b30fd0d9d581af08b9545130a417ac95094d8058
            user_id: userId})
      }

    fetch(baseurl + `items`, options)
    .then(resp => resp.json())
    .then(item => {
      if(!starter){
        displayItem(item.name)
      }
      addItem(item)
    })
}

const patchHP = (damage, userId) => {
  const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - damage
  let options = {
      method: "PATCH",
      headers: {"content-type": "application/json",
                "accept": "application/json" },
      body: JSON.stringify({current_hp: newHP})
      }

    fetch(baseurl + `users/${userId}`, options)
}

const deleteItem = (itemId) => {
  let options = {
      method: "DELETE",
      headers: {"content-type": "application/json",
                "accept": "application/json" }
      }

    fetch(baseurl + `items/${itemId}`, options)
}

function getRandomPokemon() {
  const num = Math.floor(Math.random()*151)+1  
  fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
    .then(resp => resp.json())
    .then(data => pokemonEncounter(data))
}

const postPokemon = (name, species, pokeId, userId) => {
  let options = {
    method: "POST",
    headers: {"content-type": "application/json",
              "accept": "application/json"
    },
    body: JSON.stringify({name: name,
          species: species,
          user_id: userId
          })
  }

  fetch(baseurl + `pokemons/`, options)
  .then(resp => resp.json())
  .then(pokemon => addPokemon(pokemon.name, pokemon.species, pokeId, pokemon.img_url))
}

const userLogin = (name, continueGame) => {
  let options = {
    method: "POST",
    headers: {"content-type": "application/json",
              "accept": "application/json"
    },
    body: JSON.stringify({name: name,
          })
  }

  fetch(baseurl+`users`, options)
  .then(resp => resp.json())
  .then(user => {
    if(continueGame){
      playerContinue(user)
      logoImg.dataset.currentUser = user.id
    }else{
      renderNewUser(user)
      logoImg.dataset.currentUser = user.id
    }
  })
}

const getUsers = () => {
  scoreboard.innerHTML = ""
  fetch(baseurl+`users`)
  .then(resp => resp.json())
  .then(users => {
    users.sort(function(a, b) {
      return b.score - a.score;
    }).forEach(user => {
      renderNewUser(user)
    });
  })
}

// Keeping this on the bottom because it's so long -----------------------------------------------------------------------------------------------------------------------

function validMove(currentLocation, direction) {
  switch(currentLocation) {
    case '1':
      if(direction == 'Right' || direction == 'Down'){return true}else{return false}
    case '2':
      if(direction == 'Right' || direction == 'Down' || direction == 'Left'){return true}else{return false}
    case '3':
      if(direction == 'Down'){return true}else{return false}
    case '4':
      if(direction == 'Down'){return true}else{return false}
    case '5':
      if(direction == 'Down'){return true}else{return 'north'}
    case '6':
      if(direction == 'Right' || direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '7':
      if(direction == 'Up' || direction == 'Down' || direction == 'Left'){return true}else{return false}
    case '8':
      if(direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '9':
      if(direction == 'Right' || direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '10':
      if(direction == 'Left' || direction == 'Down' || direction == 'Up'){return true}else{return false}
    case '11':
      if(direction == 'Right' || direction == 'Up'){return true}else{return false}
    case '12':
        return true
    case '13':
        return true
    case '14':
        return true
    case '15':
      if(direction == 'Left' || direction == 'Down' || direction == 'Up'){return true}else{return 'victory'}
    case '16':
      if(direction == 'Right'){return true}else{return false}
    case '17':
      if(direction == 'Right' || direction == 'Up' || direction == 'Left'){return true}else{return false}
    case '18':
        return true
    case '19':
      if(direction == 'Right' || direction == 'Up' || direction == 'Left'){return true}else{return false}
    case '20':
      if(direction == 'Up' || direction == 'Down' || direction == 'Left'){return true}else{return false}
    case '21':
      if(direction == 'Right'){return true}else{return false}
    case '22':
      if(direction == 'Right' || direction == 'Left'){return true}else{return false}
    case '23':
      if(direction == 'Right' || direction == 'Left' || direction == 'Up'){return true}else{return false}
    case '24':
      if(direction == 'Left' || direction == 'Right'){return true}else{return false}
    case '25':
      if(direction == 'Left' || direction == 'Up'){return true}else{return false}
    default:
      return true
  }
}

<<<<<<< HEAD
// setInterval(get);
getUsers()
=======
getUsers();
>>>>>>> b30fd0d9d581af08b9545130a417ac95094d8058
