import './styles.css'
import './gsStyles.css'
import { Gameboard } from './model.js';
import View from './view.js'

const Controller = (function() {
    let characterSelected;
    let topBoard = Gameboard(0,19);
    console.log(topBoard.placeShip())
    return{characterSelected};
})();

document.addEventListener('DOMContentLoaded', function() {
    const flagGif = document.getElementById('flag');
    View.fadeIn(flagGif, 500);

    const volumeButton = document.getElementById('volBtn');
    volumeButton.addEventListener('click', (e)=>{
        View.toggleMenuMusic(e.target);
    })

    const characterButtons = document.querySelectorAll(".select");
    characterButtons.forEach(button => {
        button.addEventListener('click', (e)=>{
            View.selectCharacter(e.target);
            Controller.characterSelected = e.target.id;
        })
    })

    const closeModalBtn = document.querySelector("#closeModal");
    closeModalBtn.addEventListener('click', View.resetSelectScreen);

    const modal = document.querySelector('#modal');
    modal.addEventListener('click', function(event) {
        let isClickInsideModal = document.querySelector('.modal-content').contains(event.target);
        if (!isClickInsideModal) {
           View.resetSelectScreen();
        }
    });

});

document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("ready")) {
        View.changeToGameScreen(Controller.characterSelected);
    }
});
document.querySelector(".topShips").addEventListener("mouseenter", function(event){
})