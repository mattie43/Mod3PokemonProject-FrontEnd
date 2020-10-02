music = document.querySelector(".music-container")

const stopAllMusic = () => {
    musicContainer = document.querySelector(".music-container").children
    for (const song of musicContainer) {
        song.pause()
        song.load();
    }
}

const playOpeningMusic = () => {

    music.innerHTML = `<audio id="opening-music" loop ><source src="music/opening.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#opening-music")
    audio1.volume = 0.3
    audio1.play()
}

const playPalletMusic = () => {
    music.innerHTML = `<audio id="pallet-music" loop ><source src="music/pal.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#pallet-music")
    audio1.volume = 0.3
    audio1.play()
}

const playForestMusic = () => {
    music.innerHTML = `<audio id="forest-music" loop ><source src="music/forest.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#forest-music")
    audio1.volume = 0.3
    audio1.play()
}

const playCaveMusic = () => {
    music.innerHTML = `<audio id="cave-music" loop ><source src="music/cave.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#cave-music")
    audio1.volume = 0.3
    audio1.play()
}

const playBattleMusic = () => {
    music.innerHTML = `<audio id="battle-music" loop ><source src="music/battle.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#battle-music")
    audio1.volume = 0.3
    audio1.play()
}
const playSuccessMusic = () => {
    music.innerHTML = `<audio id="win-music" ><source src="music/win.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#win-music")
    audio1.volume = 0.3
    audio1.play()
}

playGameOverMusic = () => {
    music.innerHTML = `<audio id="over-music" ><source src="music/dead.mp3" type="audio/mp3"></audio>`
    audio1 = document.querySelector("#over-music")
    audio1.volume = 0.3
    audio1.play()
}
