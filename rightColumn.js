const renderNewUser = (user) => {
  const userLi = document.createElement("li")
  userLi.id = user.id
  userLi.dataset.name = user.name.toLowerCase()
  userLi.dataset.maxHp = user.max_hp
  userLi.dataset.currentHp = user.current_hp
  userLi.innerHTML = `${capitalize(user.name)} | <strong>${user.score}</strong>`
  scoreboard.append(userLi)
}

function nameExists(username) {
  const nameList = scoreboard.querySelectorAll('li')
  for (const name of nameList) {
    if(name.dataset.name == username){return true}
  }
  return false
}