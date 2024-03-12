import './styles.css'
import './gsStyles.css'
import { Gameboard } from './model.js';
import View from './view.js'

const Controller = (function() {
    let characterSelected;
    let shipSelected;
    return{characterSelected, shipSelected};
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

let topShips = document.querySelectorAll(".topShips");
topShips.forEach(ship =>{
    ship.addEventListener("mouseenter", function(event){
        View.topShipsHover(event.target.id);
    })
    ship.addEventListener("mouseleave", function(event){
        View.topShipsDefault(event.target.id);
    })
    ship.addEventListener("click", function(e){
        View.topShipSelected(e.target.id);
        Controller.shipSelected = e.target.id;
        console.log(Controller.shipSelected)
    })
})

let leftGrid = document.querySelector("#leftGrid");
leftGrid.addEventListener("click", function(e){
    if(e.target.classList.contains("gridCell") && shipSelected != null){
        
    }
})