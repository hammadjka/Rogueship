import './styles.css'
import './gsStyles.css'
import { Player, Computer } from './model.js';
import View from './view.js'

const Controller = (function() {
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    let characterSelected;
    let shipSelected;
    let direction = Horizontal;
    let player1 = Player();
    let cpu = Computer();
    let turn = 1;

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
    const getTurn = ()=>{
        if(turn == 1){
            return "Player";
        }
        return "CPU";
    }
    const setCharacter = (char)=>{
        characterSelected = char;
    }
    const getCharacter = ()=>{
        return characterSelected;
    }
    const setShip = (ship)=>{
        shipSelected = ship; 
    }
    const getShip = ()=>{
        return shipSelected;
    }
    const resetBoard = ()=>{
        shipSelected = null;
        direction = Horizontal;
    }
    const changeTurn = ()=>{
        if(turn == 1){
            turn = 2;
        }else{
            turn = 1;
        }
    }
    const cpuMove = async ()=>{
        if(getTurn() == "CPU"){
            let coords =  cpu.makeMove();
            let attackStatus = player1.receiveAttack(coords);
            await new Promise(resolve => setTimeout(resolve, 750));
            console.log("waiting");
            await View.receiveAttack(coords, attackStatus, "player");
            console.log(coords);
            console.log(attackStatus);
            changeTurn();
        }
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
        const startBrn = document.querySelector('#startGame');
        startBrn.addEventListener("click", function(event) {
            if(event.target.classList.contains("active")){
                View.changeToGameScreen(getCharacter());
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
                    setShip(e.target.getAttribute("data-ship-type"));
                }
            })
        })
        let unselectShip = document.querySelector("#cancel");
        let rotateShip = document.querySelector("#rotate");
        unselectShip.addEventListener("click", function(e){
            View.unselectShips();
            setShip(null);
        })
        rotateShip.addEventListener("click", function(e){
            if(getShip() != null){
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
                resetBoard();
            }
        })

        let readyGameBtn = document.querySelector("#readyGame");
        readyGameBtn.addEventListener("click", function(e){
            if(e.target.classList.contains("active")){
                cpu.placeShips();
                View.start(getCharacter());
            }
        })
    
        let leftGrid = document.querySelector("#leftGrid")
        leftGrid.addEventListener("mouseenter", function(e){
            let leftCells = document.querySelectorAll(".leftCells");
            leftCells.forEach(cell =>{
                cell.addEventListener("mouseenter", function(e){
                    if(getShip() != null){
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
                        let coordinates = player1.getPlacementCoords([x,y], getDirection(), getShip());
                        let isValidPlacement = player1.checkPlacement([x,y], getDirection(), getShip());
                        View.colorPlacement(coordinates, isValidPlacement);
                    }
                })
                cell.addEventListener("mouseleave", function(e){
                    if(getShip() != null){
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/);
                        let coordinates = player1.getPlacementCoords([x,y], getDirection(), getShip());
                        View.uncolorPlacement(coordinates);
                    }
                })
                cell.addEventListener("click", function(e){
                    if(getShip() != null){
                        // console.log(getShip() + " " + getDirection());
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
                        let coordinates = player1.getPlacementCoords([x,y], getDirection(), getShip());
                        let isValidPlacement = player1.checkPlacement([x,y], getDirection(), getShip());
                        let leftCells = document.querySelectorAll(".leftCells");
                        let playerShips = document.querySelectorAll(".leftShips");
                        if(isValidPlacement){
                            player1.placeShip([x,y], getDirection(), getShip());
                            let allShipsPlaced = player1.areShipsOnBoard();
                            View.placePlayerShip(leftCells, playerShips, coordinates, getDirection(), getShip(), allShipsPlaced);
                            setShip(null);
                        }
                    }
                })
            })
        })

        let rightGrid = document.querySelector("#rightGrid");
        rightGrid.addEventListener("mouseenter", function(e){
            let rightCells = document.querySelectorAll(".rightCells");
            rightCells.forEach(cell =>{
                cell.addEventListener("mouseenter", function(e){
                    let gsRight = document.querySelector("#gsRight")
                    if(gsRight.classList.contains("gameStart")){
                        View.hoverRightCell(e.target);
                    }
                })
                cell.addEventListener("mouseleave", function(e){
                    View.unhoverRightCell(e.target);
                })
                cell.addEventListener("click", async function(e){
                    if(getTurn() == "Player"){
                        let coords = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
                        if (coords) {
                            coords = coords.slice(1).map(Number);
                        }
                        let attackStatus = cpu.receiveAttack(coords);
                        if(attackStatus != undefined){
                            changeTurn();
                            await View.receiveAttack(coords, attackStatus, "cpu");
                            new Promise(resolve => setTimeout(resolve, 500));
                            let rightCells = document.querySelectorAll(".rightCells");
                            let cpuShips = document.querySelectorAll(".rightShips");    
                            if(attackStatus == true){
                                let sunkenShips = cpu.getSunken();
                                let cpuFleet = cpu.getFleet();
                                sunkenShips.forEach(sunkenShipName =>{
                                    let shipObj = cpuFleet[sunkenShipName];
                                    View.showSunkenEnemy(sunkenShipName, rightCells, cpuShips, shipObj);
                                })
                            }
                        }
                        //trigger cpu move
                        cpuMove();
                    }
                })
            })
        })
    }


    return{init, getCharacter, getDirection, setDirection, setShip, getShip, player1};
})();

document.addEventListener('DOMContentLoaded', function() {
    Controller.init();
});



