const centerColumn = document.querySelector('.center-column')
const leftColumn = document.querySelector('.left-column')

centerColumn.addEventListener('submit', e => {
  e.preventDefault()

  // fetch user, show them the starting page/choose pokemon - e.target.username.value
  
  choosePokemon()
})

centerColumn.addEventListener('click', e => {
  if(e.target.className == 'pokemon-sprites'){
    newPlayerStart()
    addPokemon(e.target.dataset.name, e.target.dataset.id)
  }else if(e.target.dataset.name){
    addPokemon(e.target.dataset.name, e.target.dataset.id)
    removePokeBall(e.target.dataset.name)
    showCurrentLocation()
  }
})

document.addEventListener('keydown', e => {
  if(leftColumn.innerText != 'Log in first!' && e.key.slice(0, 5) == 'Arrow'){
    moveLocation(e.key.slice(5))
  }
})

function choosePokemon() {
  centerColumn.innerHTML = `
    <div class="container">
      <img class="pokemon-sprites" data-name="Pikachu" data-id="25" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png">
      <img class="pokemon-sprites" data-name="Bulbasaur" data-id="1" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
    </div>
    <div class="container">
      <img class="pokemon-sprites" data-name="Charmander" data-id="4" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png">
      <img class="pokemon-sprites" data-name="Squirtle" data-id="7" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png">
    </div>
    <p id="message">Please select your starting Pokemon!</p>
    `
}

function newPlayerStart() {
  const locationP = leftColumn.querySelector('#location-p')
  locationP.innerText = 'Pallet Town Center' // set last location name
  locationP.dataset.location = 13 // set last locaiton id
  centerColumn.innerHTML = `
    <img id="location-img" src="./images/locations/img_13.png">
    <p id="message">Welcome to Pallet Town! Use your arrow keys to move around. You can search for Pokémon to collect, but first you need to find some Poké Balls! Professor Oak has given you one to start with. He also said it's dangerous out there, so take an HP-UP as well!</p>
    `

  const pokeBallLi = document.createElement('li')
  const hpUpLi = document.createElement('li')

  // get user item and pokemon count/names
  pokeBallLi.innerHTML = `<img src="./images/inventory/poke-ball.png" class="inventory-sprite"> Poké Ball <span id="pokeball-amount">x1</span>`
  leftColumn.querySelector('#inventory-ul').append(pokeBallLi)

  hpUpLi.innerHTML = `<img src="./images/inventory/hp-up.png" class="inventory-sprite"> HP-UP <span id="hpup-amount">x1</span>`
  leftColumn.querySelector('#inventory-ul').append(hpUpLi)
}

function addPokemon(pokemonName, pokemonId) {
  if(leftColumn.querySelector('#pokeball-amount').innerText.slice(1) == 0){return}
  const pokeLi = document.createElement('li')
  pokeLi.innerText = pokemonName
  pokeLi.dataset.name = pokemonName
  pokeLi.dataset.id = pokemonId
  leftColumn.querySelector('#pokemon-ul').append(pokeLi)  
}

function removePokeBall(pokemonName) {  
  const currentAmount = leftColumn.querySelector('#pokeball-amount').innerText.slice(1)
  if(currentAmount == 0){
    centerColumn.querySelector('#message').innerText = `Try getting more Poké Balls first! And ${pokemonName} ran away!`
    return
  }
  centerColumn.querySelector('#message').innerText = `You successfully caught ${pokemonName}!`
  // update inventory in database
  leftColumn.querySelector('#pokeball-amount').innerText = 'x' + (parseInt(currentAmount) - 1)
}

function showCurrentLocation() {
  const locationId = leftColumn.querySelector('#location-p').dataset.location
  const locationImg = centerColumn.querySelector('#location-img')
  locationImg.removeAttribute("data-id")
  locationImg.removeAttribute("data-name")
  locationImg.src = `./images/locations/img_${locationId}.png`
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
  if(num < 20){
    fetchPokemon()
    return
  }else if(num > 80){
    foundItem()
    return
  }
  centerColumn.querySelector('#message').innerText = "You didn't find anything of use here. Try exploring more!"
}

function foundItem() {
  const num = Math.floor(Math.random()*2)+1
  if(num == 1){
    centerColumn.querySelector('#message').innerText = "You found a Poké Ball! Let's add it to your inventory!"
    const currentAmount = leftColumn.querySelector('#pokeball-amount').innerText.slice(1)
    // update inventory in database
    leftColumn.querySelector('#pokeball-amount').innerText = 'x' + (parseInt(currentAmount) + 1)
  }else{
    centerColumn.querySelector('#message').innerText = "You found a HP-UP! Let's add it to your inventory!"
    const currentAmount = leftColumn.querySelector('#hpup-amount').innerText.slice(1)
    // update inventory in database
    leftColumn.querySelector('#hpup-amount').innerText = 'x' + (parseInt(currentAmount) + 1)
  }
}

function fetchPokemon() {
  const num = Math.floor(Math.random()*151)+1  
  fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
    .then(resp => resp.json())
    .then(data => pokemonEncounter(data))
}

function pokemonEncounter(pokemon) {
  const capitalName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  centerColumn.querySelector('#message').innerText = `You found ${capitalName}! Click on it to try and capture it, or run away!`
  const locationImg = centerColumn.querySelector('#location-img')
  locationImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  locationImg.dataset.id = pokemon.id
  locationImg.dataset.name = capitalName
}

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