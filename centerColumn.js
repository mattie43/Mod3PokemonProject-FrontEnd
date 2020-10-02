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

  stopAllMusic()
  playSuccessMusic()
  getUsers()
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
    showCurrentLocation()
    return
  }else if(valid == 'victory'){
    failedMessage("You're not ready to head down Victroy Road!")
    showCurrentLocation()
    return
  }else if(valid == 'north'){
    failedMessage("You're not allowed in that city!")
    showCurrentLocation()
    return
  }else if(valid == 'collapse'){
    failedMessage("The cave has collapsed! You can't venture any deeper!")
    showCurrentLocation()
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
  locationP.innerText = locationNames[locationP.dataset.location]
  centerColumn.querySelector('#location-img').src = `./images/locations/img_${locationP.dataset.location}.png`

  encounterCheck()
}

function failedMessage(message) {
  centerColumn.querySelector('#message').innerText = message
}

function runAwayMusicTrigger() {
  stopAllMusic()
  playPalletMusic()
}

function encounterCheck() {
  const num = Math.floor(Math.random()*100)+1
  const currentUser = logoImg.dataset.currentUser
  if(between(num, 1, 20)){
    getRandomPokemon()
  }else if(num == 22){
    postItem('master-ball', currentUser)
  }else if(between(num, 23, 33)){
    postItem('poke-ball', currentUser)
  }else if(between(num, 34, 37)){
    postItem('ultra-ball', currentUser)
  }else if(between(num, 40, 49)){
    postItem('hp-up', currentUser)
  }else if(between(num, 50, 51)){
    postItem('health-wing', currentUser)
  }else if(between(num, 52, 55)){
    const damage = Math.floor(Math.random()*20)+1
    const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - damage
    patchHP(newHP, currentUser)
    failedMessage(`You tripped and fell! You took ${damage} damage!`)
    updateHP(damage)
  }else{
    failedMessage("You didn't find anything of use here. Try exploring more!")
  }
}

function pokemonEncounter(pokemon) {
  stopAllMusic();
  playBattleMusic();
  centerColumn.querySelector('#message').innerText = `You found ${capitalize(pokemon.name)}! Try and capture it with one of your Poké Balls, or run away!`

  const locationImg = centerColumn.querySelector('#location-img')
  locationImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  locationImg.dataset.id = pokemon.id
  locationImg.dataset.species = capitalName

  createRenameForm()
}

function displayItem(itemName) {
  centerColumn.querySelector('#message').innerText = `You found a ${itemName}! Let's add it to your inventory!`
}

function displayPokemon(pokeName, pokemon, evoName, evoImg, evoCheck) {
  centerColumn.querySelector('#location-img').src = pokemon.sprites.front_default
  centerColumn.querySelector('#message').innerHTML = `
    <p>Name: ${pokeName} | Species: ${capitalize(pokemon.name)}</p>
    <p>Height: ${decimalNum(pokemon.height)}m | Weight: ${decimalNum(pokemon.weight)}kg | Type: ${capitalize(pokemon.types[0].type.name)} | 
    HP: ${pokemon.stats[0].base_stat} | Attack: ${pokemon.stats[1].base_stat} | Defense: ${pokemon.stats[2].base_stat}</p>`

  if(pokeName != 'mew' || pokeName != 'mewtwo'){
    centerColumn.querySelector('#message').innerHTML += `
      <div class="evo-container">
        <p>Evolves ${evoCheck}: ${capitalize(evoName)}</p>
        <img src="${evoImg}">
      </div>`
  }
}

function gameOverScreen() {
  centerColumn.innerHTML = `
    <img class="game-over" id="location-img" src="./images/locations/gameover.jpg">
    <p id="message">You have run out of HP and fallen. Your rank will stay on the scoreboard, but you cannot continue playing.</p>
    `
  stopAllMusic();
  playGameOverMusic();
}