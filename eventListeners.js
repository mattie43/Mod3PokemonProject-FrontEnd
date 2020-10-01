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
    if(leftColumn.querySelector('#hp-p').innerText == '100'){
      centerColumn.querySelector('#message').innerText = 'You are already at full HP!'
    }else{
      if(e.target.id.slice(0,2) == 'hp'){addHP(20)}else{addHP(40)}
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