
import volumeOn from './assets/menu/volume-high.svg';
import volumeOff from './assets/menu/volume-off.svg';
import pirateImg from './assets/characters/pidle2.gif'
import vikingImg from './assets/characters/vikingIdle.gif'

import menuMusic from './assets/sounds/GameMusic/Menu.wav'
import levleMusic from './assets/sounds/GameMusic/Level.wav'
import combatMusic from './assets/sounds/GameMusic/Combat.wav'

import viking1 from './assets/sounds/VikingDialogue/sheildTosheild.wav'
import viking2 from './assets/sounds/VikingDialogue/thorJudge.wav'
import viking3 from './assets/sounds/VikingDialogue/valhallaAdmits.wav'
import viking4 from './assets/sounds/VikingDialogue/leaveMe.wav'

import pirate1 from './assets/sounds/PirateDialogue/allHands1.wav'
import pirate2 from './assets/sounds/PirateDialogue/hoistJelly.wav'
import pirate3 from './assets/sounds/PirateDialogue/meRum.wav'
import pirate4 from './assets/sounds/PirateDialogue/battenHatches.wav'
import { Ship } from './model';

const GameAudio = (function(){
    const menu = new Audio(menuMusic);
    const stage = new Audio(levleMusic);
    const combat = new Audio(combatMusic);
    menu.volume = 0.7;
    combat.volume = 0.7;

    const V_SelectD1 = new Audio(viking1);
    const V_SelectD2 = new Audio(viking2);
    const V_SelectD3 = new Audio(viking3);
    const V_SelectD4 = new Audio(viking4);

    const P_SelectD1 = new Audio(pirate1);
    const P_SelectD2 = new Audio(pirate2);
    const P_SelectD3 = new Audio(pirate3);
    const P_SelectD4 = new Audio(pirate4);



    const bgMusic = {menu, stage, combat};
    const dialogueObj = {
                        "viking": {V_SelectD1, V_SelectD2, V_SelectD3, V_SelectD4},
                        "pirate": {P_SelectD1, P_SelectD2, P_SelectD3, P_SelectD4}
    }

    const playSelectDialogue = (character)=>{
        stopAllDialogues();
        let audioName;
        for(let ch in dialogueObj){
            if (ch === character){
                const audios = Object.keys(dialogueObj[ch]);
                const randomIndex = Math.floor(Math.random() * audios.length);
                audioName = audios[randomIndex];
            }
        }
        let dialogue =  dialogueObj[character][audioName];
        menu.volume = 0.35;
        dialogue.play()
            .catch((error) => {
                console.log(error);
            });
        dialogue.addEventListener('ended', function() {
            menu.volume = 0.7;
        });
    }
    const stopDialogue = (character, audioName)=>{
        dialogueObj[character][audioName].pause();
        dialogueObj[character][audioName].currentTime = 0;
    }
    const stopAllDialogues = ()=>{
        for (let character in dialogueObj) {
            for(let dialogue in dialogueObj[character]){
                stopDialogue(character, dialogue);
            }
        }
        menu.volume = 0.7;    
    }
    const playBgMusic = (audioName)=>{
        stopAllBgMusic();
        bgMusic[audioName].loop = true;
        bgMusic[audioName].play();
    }
    const stopBgMusic = (audioName)=>{
        bgMusic[audioName].pause();
    }
    const stopAllBgMusic = ()=>{
        for(let audio in bgMusic){
            stopBgMusic(audio);
        }
    }
    return{playSelectDialogue, playBgMusic, stopBgMusic, stopAllDialogues, stopDialogue}
})();

const View = (function() {
    const shipCoordinates = {
        "top-carrier":[[14,0],[15,0],[16,0],[17,0],[18,0],[14,1],[15,1],[16,1],[17,1],[18,1]], 
        "top-battleship":[[6,0],[7,0],[8,0],[9,0],[6,1],[7,1],[8,1],[9,1]], 
        "top-cruiser":[[10,2],[11,2],[12,2]], 
        "top-submarine":[[1,0], [2,0], [3,0]], 
        "top-destroyer":[[1,2], [2,2]]
    }

    const toggleMenuMusic = (button)=>{
        let img = document.querySelector("#volImg");
        if(button.classList.contains("off")){
            GameAudio.playBgMusic("menu");
            img.src = volumeOn;
            button.classList = [];
            button.classList.add("on");
        }else{
            GameAudio.stopBgMusic("menu");
            img.src = volumeOff;
            button.classList = [];
            button.classList.add("off");
        }
    }
    const fadeIn = (element, duration) => {
        var opacity = 0;
        var interval = 50; // Interval in milliseconds
        var delta = 1 / (duration / interval);
    
        var timer = setInterval(function() {
            opacity += delta;
            element.style.opacity = opacity;
    
            if (opacity >= 1) {
                clearInterval(timer);
            }
        }, interval);
    }
    const resetSelectScreen = ()=>{
        let characterButtons = document.querySelectorAll(".select");
        characterButtons.forEach(button => {
            button.style.backgroundColor = "inherit";
        });
        document.querySelector("#startGame").classList.remove("active");
        GameAudio.stopAllDialogues();
    }
    const selectCharacter = (character)=>{
        resetSelectScreen();
        character.style.backgroundColor = "#E3E3E3";
        document.querySelector("#startGame").classList.add("active");
        if(character.id == "viking"){
            GameAudio.playSelectDialogue("viking");
        }else if(character.id == "pirate"){
            GameAudio.playSelectDialogue("pirate");
        }
    }
    const changeToGameScreen = (characterName)=>{
        resetSelectScreen();
        document.querySelector("#closeModal").click();
        document.querySelector("#content").style.display = "none";
        document.querySelector("#gameScreen").style.display = "grid";
        document.querySelector("#gsBackground").style.display = "block";
        const leftGrid = document.querySelector("#leftGrid");
        const rightGrid = document.querySelector("#rightGrid");
        const topBar = document.querySelector("#topGrid");
        displayCharacters(characterName)
        constructGrid([10,10], leftGrid, "leftCells");
        constructGrid([10,10], rightGrid, "rightCells");
        constructGrid([3,20], topBar, "topCells");
        GameAudio.playBgMusic("stage");
    }

    const constructGrid = (dimensions, parentDiv, cellClass)=>{
        for (let i = 0; i < dimensions[0]; i++) {
            for(let j=0; j<dimensions[1]; j++){
                const div = document.createElement('div');
                div.classList.add("gridCell");
                div.classList.add(cellClass);
                div.setAttribute('data-coords', '_' + j + '_' + i);                
                parentDiv.appendChild(div);
            }
        }
    }

    const displayCharacters = (characterName)=>{
        const playerImg = document.querySelector("#playerImage");
        const oppImg = document.querySelector("#opponentImage");
        if(characterName == "viking"){
            playerImg.src = vikingImg;
            oppImg.src = pirateImg;
        }else{
            playerImg.src = pirateImg;
            oppImg.src = vikingImg;
        }
        oppImg.style.transform = 'scaleX(-1)';
    }

    const cellsAddClass = (cells, gridLength, coordinates, cellClass)=>{
        coordinates.forEach(coordinate =>{
            let index = +coordinate[1]*gridLength + +coordinate[0];
            cells[index].classList.add(cellClass);
        })
    }
    const cellsRemoveClass = (cells, gridLength, coordinates, cellClass)=>{
        coordinates.forEach(coordinate =>{
            let index = +coordinate[1]*gridLength + +coordinate[0];
            cells[index].classList.remove(cellClass);
        })
    }


    //mouseenter behaviour to set hover effects
    const topShipsHover = (shipId) => {
        let ship = document.getElementById(shipId);
        if(ship.classList.contains("selected") || ship.classList.contains("shipUnavailable")){
            return; //can't hover over ship if it's currently selected or already placed.
        }

        const coordinates = shipCoordinates[shipId];
        let topCells = document.querySelectorAll(".topCells")
        cellsAddClass(topCells, 20, coordinates, "cellHover");
        ship.classList.add("shipHover");
    }

    //mouseleave behavior to reset hover effects
    const topShipsDefault = (shipId)=>{
        const coordinates = shipCoordinates[shipId];
        let topCells = document.querySelectorAll(".topCells")
        cellsRemoveClass(topCells, 20, coordinates, "cellHover");
        document.getElementById(shipId).classList.remove("shipHover");
    }

    //click behavior to show ship is selected.
    const topShipSelected = (shipId)=>{
        let ship = document.getElementById(shipId);
        if(ship.classList.contains("selected") || ship.classList.contains("shipUnavailable")){
            return false; //can't select ship if it's already selected or placed.
        }

        let topCells = document.querySelectorAll(".topCells")
        //reset previous ships that might have been selected and unmark corresponding cells. 
        unselectShips();
        //select the required ship, mark the cells
        let coordinates = shipCoordinates[shipId];
        cellsAddClass(topCells, 20, coordinates, "cellSelected");
        topShipsDefault(shipId);
        document.getElementById(shipId).classList.add("selected"); //to mark the ship as selected, so hover effects are ignored.
        let optionBtns = document.querySelectorAll(".optionBtn");
        optionBtns.forEach(optionBtn =>{
            optionBtn.classList.add("clickable");
        })
        return true;
    }
    const unselectShips = ()=>{
        let optionBtns = document.querySelectorAll(".optionBtn");
        optionBtns.forEach(optionBtn =>{
            optionBtn.classList.remove("clickable");
        })

        let topCells = document.querySelectorAll(".topCells")
        let coordinates;
        for(let shipName in shipCoordinates){
            let ship = document.getElementById(shipName);
            coordinates = shipCoordinates[shipName];
            if(ship.classList.contains("selected")){
                cellsRemoveClass(topCells, 20, coordinates, "cellSelected");
                ship.classList.remove("selected"); //unselect the ship
            }
        }
    }

    const topShipUnavailable = (leftShip)=>{
        let topCells = document.querySelectorAll(".topCells");
        let topShip = leftShip.id.replace("left", "top");
        let coordinates = shipCoordinates[topShip];

        cellsRemoveClass(topCells, 20, coordinates, "cellHover");
        cellsAddClass(topCells, 20, coordinates, "cellUnavailable");
        document.getElementById(topShip).classList.add("shipUnavailable");
        unselectShips();
    }
    const topShipAvailable = (leftShip)=>{
        let topCells = document.querySelectorAll(".topCells");
        let topShip = leftShip.id.replace("left", "top");
        let coordinates = shipCoordinates[topShip];
        cellsRemoveClass(topCells, 20, coordinates, "cellUnavailable");
        document.getElementById(topShip).classList.remove("shipUnavailable");
        topShipsDefault(topShip);
    }

    const colorPlacement = (shipCoordinates, isValidPlacment)=>{
        let leftCells = document.querySelectorAll(".leftCells")
        if(isValidPlacment){
            cellsAddClass(leftCells, 10, shipCoordinates, "validPlacement")
        }else{
            cellsAddClass(leftCells, 10, shipCoordinates, "invalidPlacement");   
        }
    }
    const uncolorPlacement = (shipCoordinates)=>{
        let leftCells = document.querySelectorAll(".leftCells");
        cellsRemoveClass(leftCells, 10, shipCoordinates, "validPlacement");
        cellsRemoveClass(leftCells, 10, shipCoordinates, "invalidPlacement");

    }
    const triggerRotation = (rotateBtn, direction)=>{
        if(direction == "horizontal"){
            rotateBtn.classList.remove("horizontal");
            rotateBtn.classList.add("vertical");
        }else{
            rotateBtn.classList.remove("vertical");
            rotateBtn.classList.add("horizontal")
        }
    }


    const placeShip = (shipPos, direction, shipName)=>{   
        let leftCells = document.querySelectorAll(".leftCells");
        let playerShips = document.querySelectorAll(".leftShips");

        cellsRemoveClass(leftCells, 10, shipPos, "validPlacement");
        playerShips.forEach(ship=>{
            if(shipName == ship.getAttribute("data-ship-type")){
                ship.style.display = "inline"
                ship.style.left = "calc(" + shipPos[0][0] + "*var(--cell-size) + 1px)"
                ship.style.top =  "calc(" + shipPos[0][1] + "*var(--cell-size) + 1px)"

                if(direction == "vertical"){
                    let rotateOffset = "(" + ship.getAttribute("data-width") + " * var(--cell-size)/2)"
                    ship.style.transformOrigin = "calc(" + rotateOffset+")";
                    ship.style.transform = "rotate(90deg)";
                }
                topShipUnavailable(ship);
            }
        })
        document.querySelector("#resetBoard").classList.add("active")
    }

    const resetBoard = ()=>{
        document.querySelector("#resetBoard").classList.remove("active");
        let playerShips = document.querySelectorAll(".leftShips");
        playerShips.forEach(ship=>{
            ship.style.display = "none";
            topShipAvailable(ship);
        })
    }
    return {fadeIn, 
        toggleMenuMusic, 
        selectCharacter, 
        resetSelectScreen, 
        changeToGameScreen, 
        topShipsDefault, 
        topShipsHover,
        topShipSelected,
        unselectShips,
        colorPlacement,
        uncolorPlacement,
        triggerRotation,
        placeShip,
        resetBoard,
    }
})();

export default View;