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
    addPokemon(pokemon.name, pokemon.species, pokemon.api_id, pokemon.img_url)
  }
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
