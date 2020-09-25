class Pokemon {
  constructor(name){
    this.name = name
  }

  static getPokemon(name){
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(resp => resp.json())
      .then(data => printPokemon(data))
  }
}