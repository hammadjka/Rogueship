import './styles.css'
import './gsStyles.css'
import { Player } from './model.js';
import View from './view.js'

const Controller = (function() {
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    let characterSelected;
    let shipSelected;
    let direction = Horizontal;
    let player1 = Player();

    const setDirection = (dir) =>{
        if(dir != Horizontal && dir != Vertical){
            console.log("incorrect direction passed " + dir)
            return;
        }
        direction = dir;
    }
    const getDirection = ()=>{
        return direction;
    }
    const setCharacter = (char)=>{
        characterSelected = setCharacter
    }
    const getCharacter = ()=>{
        return characterSelected;
    }

    const init = ()=>{
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
                setCharacter(e.target.id);
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
                let selectable = View.topShipSelected(e.target.id);
                if(selectable){
                    shipSelected = e.target.getAttribute("data-ship-type");
                }
            })
        })
        let unselectShip = document.querySelector("#cancel");
        let rotateShip = document.querySelector("#rotate");
        unselectShip.addEventListener("click", function(e){
            View.unselectShips();
            shipSelected = null;
        })
        rotateShip.addEventListener("click", function(e){
            if(shipSelected != null){
                View.triggerRotation(e.target, getDirection());
                if(getDirection() == Horizontal){
                    setDirection(Vertical);
                }else{
                    setDirection(Horizontal);
                }
            }
        })

        let resetBoardBtn = document.querySelector("#resetBoard");
        resetBoardBtn.addEventListener("click", function(e){
            if(e.target.classList.contains("active")){
                player1.resetBoard();
                View.resetBoard();
            }
        })
    
        document.querySelector("#leftGrid").addEventListener("mouseenter", function(e){
            let leftCells = document.querySelectorAll(".leftCells");
            leftCells.forEach(cell =>{
                cell.addEventListener("mouseenter", function(e){
                    if(shipSelected != null){
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
                        let coordinates = player1.getPlacementCoords([x,y], direction, shipSelected);
                        let isValidPlacement = player1.checkPlacement([x,y], direction, shipSelected);
                        View.colorPlacement(coordinates, isValidPlacement);
                    }
                })
                cell.addEventListener("mouseleave", function(e){
                    if(shipSelected != null){
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/);
                        let coordinates = player1.getPlacementCoords([x,y], direction, shipSelected);
                        View.uncolorPlacement(coordinates);
                    }
                })
                cell.addEventListener("click", function(e){
                    if(shipSelected != null){
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
                        let coordinates = player1.getPlacementCoords([x,y], direction, shipSelected);
                        let isValidPlacement = player1.checkPlacement([x,y], direction, shipSelected);
                        if(isValidPlacement){
                            View.placeShip(coordinates, direction, shipSelected);
                            player1.placeShip([x,y], direction, shipSelected);
                            shipSelected = null;
                        }

                    }
                })
            })
        })
    }


    return{init, getCharacter, getDirection, shipSelected, direction, player1, setDirection};
})();

document.addEventListener('DOMContentLoaded', function() {
    Controller.init();
});

document.body.addEventListener("click", function(event) {
    if (event.target.id === "startGame") {
        if(event.target.classList.contains("active")){
            View.changeToGameScreen(Controller.getCharacter());
        }
    }
});

