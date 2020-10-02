const postItem = (itemName, userId, starter) => {
  let options = {
      method: "POST",
      headers: {"content-type": "application/json",
                "accept": "application/json" },
      body: JSON.stringify({api_id: itemName,
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

const patchHP = (newHP, userId) => {
  let options = {
      method: "PATCH",
      headers: {"content-type": "application/json",
                "accept": "application/json" },
      body: JSON.stringify({current_hp: newHP})
      }

    fetch(baseurl + `users/${userId}`, options)
}

const deleteItem = (itemId, userId) => {
  let options = {
      method: "DELETE",
      headers: {"content-type": "application/json",
                "accept": "application/json" },
      body: JSON.stringify({api_id: itemId,
                            user_id: userId})
      }

    fetch(baseurl + `items/${itemId}`, options)
}

const getRandomPokemon = () => {
  const num = Math.floor(Math.random()*151)+1  
  fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
    .then(resp => resp.json())
    .then(data => pokemonEncounter(data))
}

const postPokemon = (name, species, userId) => {
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
  .then(pokemon => addPokemon(pokemon.name, pokemon.species, pokemon.id, pokemon.img_url))
}

const getPokemonFromDB = (pokeId) => {
  fetch(baseurl + `pokemons/${pokeId}`)
    .then(resp => resp.json())
    .then(pokemon => getPokemon(pokemon.name, pokemon.species))
}
const getPokemon = (pokeName, pokeSpecies) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokeSpecies}`)
    .then(resp => resp.json())
    .then(pokemon => getPokemonSpecies(pokeName, pokemon))
}
const getPokemonSpecies = (pokeName, pokemonObj) => {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonObj.name}`)
    .then(resp => resp.json())
    .then(species => getPokemonEvolution(pokeName, pokemonObj, species.evolution_chain.url))
}
const getPokemonEvolution = (pokeName, pokemonObj, url) => {
  fetch(url)
    .then(resp => resp.json())
    .then(evolutionChain => {
      if(pokemonObj.name == evolutionChain.chain.species.name){
        getPokemonEvolutionImg(pokeName, pokemonObj, evolutionChain.chain.evolves_to[0].species.name, 'to')
      }else if(pokemonObj.name == evolutionChain.chain.evolves_to[0].species.name){
        getPokemonEvolutionImg(pokeName, pokemonObj, evolutionChain.chain.evolves_to[0].evolves_to[0].species.name, 'to')
      }else if(evolutionChain.chain.evolves_to[0].species.name){
        getPokemonEvolutionImg(pokeName, pokemonObj, evolutionChain.chain.evolves_to[0].species.name, 'from')
      }else{
        getPokemonEvolutionImg(pokeName, pokemonObj, evolutionChain.chain.species.name, 'from')
      }
    })
}
const getPokemonEvolutionImg = (pokeName, pokemonObj, evolutionName, evoCheck) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionName}`)
    .then(resp => resp.json())
    .then(evoPoke => displayPokemon(pokeName, pokemonObj, evolutionName, evoPoke.sprites.front_default, evoCheck))
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
      logoImg.dataset.currentUser = user.id
      playerContinue(user)
    }else{
      logoImg.dataset.currentUser = user.id
      renderNewUser(user)
    }
  })
}

const getUsers = () => {
  fetch(baseurl+`users`)
  .then(resp => resp.json())
  .then(users => {
    scoreboard.innerHTML = ''
    users.sort(function(a, b) {
      return b.score - a.score;
    }).forEach(user => {
      renderNewUser(user)
    });
  })
}

getUsers()