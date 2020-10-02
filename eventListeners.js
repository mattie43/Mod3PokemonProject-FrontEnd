document.addEventListener('keydown', e => {
  if(leftColumn.innerText != 'Log in first!' && !centerColumn.querySelector('.game-over') && e.key.slice(0, 5) == 'Arrow'){
    moveLocation(e.key.slice(5))
  }
})

leftColumn.addEventListener('click', e => {
  if(centerColumn.querySelector('#location-img').dataset.species && e.target.id.slice(-4) == 'ball' && centerColumn.querySelector('#rename-form').className == 'close'){
    if(e.target.querySelector('span').innerText.slice(1) == '0'){
      centerColumn.querySelector('#message').innerText = "You don't have anymore of those Poké Balls to try and capture it with!"
    }else{
      const pokemonEl = centerColumn.querySelector('#location-img')
      const pokeBallCheck = e.target.id.slice(0,4)
      const chance = Math.floor(Math.random()*10)+1
      const damage = Math.floor(Math.random()*30)+1
      removeItem(e.target)
      
      if(pokeBallCheck == 'poke'){
        if(chance > 4){
          stopAllMusic();
          playPalletMusic();
          const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - damage
          patchHP(newHP, logoImg.dataset.currentUser)
          centerColumn.querySelector('#message').innerText = `You failed to catch ${pokemonEl.dataset.species}! They ran away and you took ${damage} damage!`
          showCurrentLocation()
          updateHP(damage)
          return       
        }
      }else if(pokeBallCheck == 'ultr'){
        if(chance > 8){
          stopAllMusic();
          playPalletMusic();
          const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - damage
          patchHP(newHP, logoImg.dataset.currentUser)
          updateHP(damage)
          centerColumn.querySelector('#message').innerText = `You failed to catch ${pokemonEl.dataset.species}! They ran away and you took ${damage} damage!`
          showCurrentLocation()
          return
        }        
      }
      else 
        if(chance > 8){
          stopAllMusic();
          playPalletMusic();
          const newHP = parseInt(leftColumn.querySelector('#hp-p').innerText) - damage
          patchHP(newHP, logoImg.dataset.currentUser)
          updateHP(damage)
          centerColumn.querySelector('#message').innerText = `You failed to catch ${pokemonEl.dataset.species}! They ran away and you took ${damage} damage!`
          showCurrentLocation()
          return
        }
      centerColumn.querySelector('#message').innerText = `You successfully caught ${pokemonEl.dataset.species}!`
      showRenameForm(pokemonEl.dataset.species, pokemonEl.dataset.id)
    }
  }else if(e.target.id.slice(0,2) == 'hp' && !centerColumn.querySelector('.game-over') || e.target.id.slice(0,6) == 'health' && !centerColumn.querySelector('.game-over')){
    if(leftColumn.querySelector('#hp-p').innerText == '100'){
      centerColumn.querySelector('#message').innerText = 'You are already at full HP!'
    }else{
      if(e.target.id.slice(0,2) == 'hp'){addHP(10)}else{addHP(20)}
      removeItem(e.target)
    }
  }else if(e.target.dataset.id && !centerColumn.querySelector('.game-over')){
    getPokemonFromDB(e.target.dataset.id)
  }
})

centerColumn.addEventListener('submit', e => {
  e.preventDefault()
  
  if(e.target.className == 'login-form'){
    if(nameExists(e.target.username.value)){
      userLogin(e.target.username.value, true)
      playPalletMusic();
      showCurrentLocation()
    }else{
      userLogin(e.target.username.value)
      playOpeningMusic();
      chooseStartingPokemon()
    }
  }else if(e.target.id == 'starter-form'){
    newPlayerStart()
    postPokemon(e.target.name.value, e.target.dataset.species, logoImg.dataset.currentUser)
  }else if(e.target.id == 'rename-form'){
    stopAllMusic()
    playPalletMusic()
    postPokemon(e.target.name.value, e.target.dataset.species, logoImg.dataset.currentUser)
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