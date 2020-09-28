const centerColumn = document.querySelector('.center-column')
const leftColumn = document.querySelector('.left-column')

centerColumn.addEventListener('submit', e => {
  e.preventDefault()

  // fetch user, show them the starting page/choose pokemon - e.target.username.value
  
  choosePokemon()
})

centerColumn.addEventListener('click', e => {
  if(e.target.className == 'pokemon-sprites'){
    getStartingLocation(e.target.id)
  }
})

document.addEventListener('keydown', e => {
  if(leftColumn.innerText != 'Log in first!' && e.key.slice(0, 5) == 'Arrow'){
    // console.log(e.key)
    moveLocation(e.key)
  }
})

function choosePokemon() {
  centerColumn.innerHTML = `
    <div class="container">
      <img class="pokemon-sprites" id="Pikachu" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png">
      <img class="pokemon-sprites" id="Bulbasaur" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
    </div>
    <div class="container">
      <img class="pokemon-sprites" id="Charmander" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png">
      <img class="pokemon-sprites" id="Squirtle" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png">
    </div>
    <p id="message">Please select your starting Pokemon!</p>
    `
}

function getStartingLocation(pokemonName) {  
  leftColumn.querySelector('#location-p').innerText = 'Pallet Town'

  const pokeBallLi = document.createElement('li')
  const hpUpLi = document.createElement('li')
  const pokeLi = document.createElement('li')

  pokeBallLi.innerHTML = `<img src="./images/inventory/poke-ball.png" class="inventory-sprite"> Poké Ball`
  leftColumn.querySelector('#inventory-ul').append(pokeBallLi)

  hpUpLi.innerHTML = `<img src="./images/inventory/hp-up.png" class="inventory-sprite"> HP UP`
  leftColumn.querySelector('#inventory-ul').append(hpUpLi)

  pokeLi.innerText = pokemonName
  leftColumn.querySelector('#pokemon-ul').append(pokeLi)

  centerColumn.innerHTML = `
    <img id="location-img" src="./images/locations/FL_Silph_Company.png">
    <p id="message">Welcome to Pallet Town! Use your arrow keys to move around. You can search for Pokémon to collect, but first you need to find some Poké Balls! Professor Oak has given you one to start with. He also said it's dangerous out there, so take an HP-UP as well!</p>
    `
}

function moveLocation(keyPress) {
  // move around the grid
}