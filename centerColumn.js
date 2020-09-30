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
  }else if(between(num, 16, 17)){
    postItem('master-ball', currentUser)
  }else if(between(num, 20, 29)){
    postItem('poke-ball', currentUser)
  }else if(between(num, 30, 35)){
    postItem('ultra-ball', currentUser)
  }else if(between(num, 40, 49)){
    postItem('hp-up', currentUser)
  }else if(between(num, 50, 51)){
    postItem('health-wing', currentUser)
  }else if(between(num, 52, 80)){
    const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - 15
    patchHP(newHP, currentUser)
    updateHP(15)
  }else if(between(num, 81, 90)){
    const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - 40
    patchHP(newHP, currentUser)
    updateHP(40)
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