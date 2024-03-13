import './styles.css'
import './gsStyles.css'
import { Player } from './model.js';
import View from './view.js'

const Controller = (function() {
    let characterSelected;
    let shipSelected;
    let direction = "horizontal"
    let player1 = Player();
    return{characterSelected, shipSelected, direction, player1};
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
            Controller.shipSelected = e.target.getAttribute("data-ship-type");
            // console.log(Controller.shipSelected)
        })
    })

    document.querySelector("#leftGrid").addEventListener("mouseenter", function(e){
        let leftCells = document.querySelectorAll(".leftCells");
        leftCells.forEach(cell =>{
            cell.addEventListener("mouseenter", function(e){
                if(Controller.shipSelected != null){
                    let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
                    let coordinates = Controller.player1.getPlacementCoords([x,y], Controller.direction, Controller.shipSelected);
                    let isValidPlacement = Controller.player1.checkPlacement([x,y], Controller.direction, Controller.shipSelected);
                    View.colorPlacement(coordinates, isValidPlacement);
                }
            })
            cell.addEventListener("mouseleave", function(e){
                if(Controller.shipSelected != null){
                    let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/);
                    let coordinates = Controller.player1.getPlacementCoords([x,y], Controller.direction, Controller.shipSelected);
                    View.uncolorPlacement(coordinates);
                }
            })
        })
    })

});

document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("ready")) {
        View.changeToGameScreen(Controller.characterSelected);
    }
});

