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

getUsers()