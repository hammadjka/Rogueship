
import volumeOn from './assets/menu/volume-high.svg';
import volumeOff from './assets/menu/volume-off.svg';
import pirateImg from './assets/characters/pidle2.gif'
import vikingImg from './assets/characters/vikingIdle.gif'

import menuMusic from './assets/sounds/GameMusic/Menu.wav'
import levleMusic from './assets/sounds/GameMusic/Level.wav'
import combatMusic from './assets/sounds/GameMusic/Combat.wav'
import hitSound from './assets/sounds/GameMusic/hit.wav'
import missSound from './assets/sounds/GameMusic/miss.wav'
import victorySound from './assets/sounds/GameMusic/victory.wav'
import loseSound from './assets/sounds/GameMusic/lose.wav'

import viking1 from './assets/sounds/VikingDialogue/sheildTosheild.wav'
import viking2 from './assets/sounds/VikingDialogue/thorJudge.wav'
import viking3 from './assets/sounds/VikingDialogue/valhallaAdmits.wav'
import viking4 from './assets/sounds/VikingDialogue/leaveMe.wav'
import viking5 from './assets/sounds/VikingDialogue/toArms.wav'
import viking6 from './assets/sounds/VikingDialogue/notPossible.wav'
import viking7 from './assets/sounds/VikingDialogue/goldCanBuy.wav'

import pirate1 from './assets/sounds/PirateDialogue/allHands1.wav'
import pirate2 from './assets/sounds/PirateDialogue/fireInTheHole.wav'
import pirate3 from './assets/sounds/PirateDialogue/walkThePlank.wav'
import pirate4 from './assets/sounds/PirateDialogue/battenHatches.wav'
import pirate5 from './assets/sounds/PirateDialogue/hoistJelly.wav'
import pirate6 from './assets/sounds/PirateDialogue/abandon.wav'
import pirate7 from './assets/sounds/PirateDialogue/deadMan.wav'

const GameAudio = (function(){
    let mute = true;
    const menu = new Audio(menuMusic);
    const stage = new Audio(levleMusic);
    const combat = new Audio(combatMusic);
    const hit = new Audio(hitSound); 
    const miss = new Audio(missSound);
    const victory = new Audio(victorySound);
    const lose = new Audio(loseSound);
    menu.volume = 0.7;
    combat.volume = 0.5;

    const V_SelectD1 = new Audio(viking1);
    const V_SelectD2 = new Audio(viking2);
    const V_SelectD3 = new Audio(viking3);
    const V_SelectD4 = new Audio(viking4);

    const P_SelectD1 = new Audio(pirate1);
    const P_SelectD2 = new Audio(pirate2);
    const P_SelectD3 = new Audio(pirate3);
    const P_SelectD4 = new Audio(pirate4);

    const V_Start = new Audio(viking5);
    const P_Start = new Audio(pirate5);

    const P_Lose = new Audio(pirate6);
    const P_Win = new Audio(pirate7)
    const V_Lose = new Audio(viking6);
    const V_Win = new Audio(viking7);

    const bgMusic = {menu, stage, combat, victory, lose};
    const dialogueObj = {
                        "viking": {V_SelectD1, V_SelectD2, V_SelectD3, V_SelectD4},
                        "pirate": {P_SelectD1, P_SelectD2, P_SelectD3, P_SelectD4}
    }

    const playSelectDialogue = (character)=>{
        if(mute){
            return;
        }
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
        const audio = dialogueObj[character][audioName];
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
    const stopAllDialogues = ()=>{
        for (let character in dialogueObj) {
            for(let dialogue in dialogueObj[character]){
                stopDialogue(character, dialogue);
            }
        }
        menu.volume = 0.7;    
    }
    const playBgMusic = (audioName, isLooped = true, fromStart = false) => {
        if(mute){
            return;
        }
        stopAllBgMusic();
        const audio = bgMusic[audioName];
        audio.volume = 0; // Start with zero volume
        if(fromStart){
            audio.currentTime = 0;
        }
        if(isLooped){
            audio.loop = true;
        }
        if (audio.paused) {
            audio.play().catch(error => {
                // Handle error if the play() method fails
                console.error('Failed to play audio:', error);
            });
        }
        let fadeDuration = 2000;
        let currentTime = 0;
        const fadeInInterval = 50; // Adjust the interval for smoother fading
    
        const fadeStep = () => {
            currentTime += fadeInInterval;
            if (currentTime < fadeDuration) {
                audio.volume = (currentTime / fadeDuration);
                setTimeout(fadeStep, fadeInInterval);
            } else {
                audio.volume = 1; // Ensure volume is at maximum at the end
            }
        };
    
        fadeStep();
    };
    const stopBgMusic = (audioName)=>{
        bgMusic[audioName].pause();
    }
    const stopAllBgMusic = ()=>{
        for(let audio in bgMusic){
            stopBgMusic(audio);
        }
    }
    const playStartDialogue = (character)=>{
        if(mute){
            return;
        }
        if(character == "viking"){
            let dialogue =  V_Start;
            menu.volume = 0.35;
            dialogue.play()
        }else{
            let dialogue =  P_Start;
            menu.volume = 0.35;
            dialogue.play()
        }
    }
    const playEndDialogue = (character, won)=>{
        if(mute){
            return;
        }
        combat.volume = 0.35;
        return new Promise((resolve) => {
            if(won){
                if(character == "pirate"){
                    let dialogue =  P_Win;
                    setTimeout(() => {
                        dialogue.play();
                        dialogue.onended = resolve;
                    }, 50);
                }else if(character == "viking"){
                    let dialogue =  V_Win;
                    setTimeout(() => {
                        dialogue.play();
                        dialogue.onended = resolve;
                    }, 50);
                }
            }
            else if(!won){
                if(character == "pirate"){
                    let dialogue =  P_Lose;
                    setTimeout(() => {
                        dialogue.play();
                        dialogue.onended = resolve;
                    }, 50);
                }
                else if(character == "viking"){
                    let dialogue =  V_Lose;
                    setTimeout(() => {
                        dialogue.play();
                        dialogue.onended = resolve;
                    }, 50);
                }
            }
        })
    }

    const attackEffects = (attackStatus) => {
        if(mute){
            return;
        }
        hit.pause();
        miss.pause();
        hit.currentTime = 0;
        miss.currentTime = 0;
    
        return new Promise((resolve) => {
            if (attackStatus) {
                setTimeout(() => {
                    hit.play();
                    hit.onended = resolve;
                }, 50);
            } else {
                setTimeout(() => {
                    miss.play();
                    miss.onended = resolve;
                }, 50);
            }
        });
    }
    const isAudioAllowed = (check)=>{
        mute = !check;
        console.log(mute);
    }
    return{isAudioAllowed,
        playSelectDialogue,
        playStartDialogue, 
        playBgMusic, 
        stopBgMusic, 
        stopAllDialogues, 
        stopDialogue, 
        playEndDialogue,
        attackEffects,
        stopAllBgMusic}
})();

const View = (function() {
    const shipCoordinates = {
        "top-carrier":[[14,0],[15,0],[16,0],[17,0],[18,0],[14,1],[15,1],[16,1],[17,1],[18,1]], 
        "top-battleship":[[6,0],[7,0],[8,0],[9,0],[6,1],[7,1],[8,1],[9,1]], 
        "top-cruiser":[[10,2],[11,2],[12,2]], 
        "top-submarine":[[1,0], [2,0], [3,0]], 
        "top-destroyer":[[1,2], [2,2]]
    }
    const shipNames = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];
    const toggleMenuMusic = ()=>{
        let button = document.getElementById('volBtn');
        let img = document.querySelector("#volImg");
        if(button.classList.contains("off")){
            GameAudio.isAudioAllowed(true);
            GameAudio.playBgMusic("menu");
            img.src = volumeOn;
            button.classList = [];
            button.classList.add("on");
        }else{
            GameAudio.isAudioAllowed(false);
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
        displayCharacters(characterName)

        const leftGrid = document.querySelector("#leftGrid");
        const rightGrid = document.querySelector("#rightGrid");
        const topBar = document.querySelector("#topGrid");
        if(!document.querySelector(".leftCells") && !document.querySelector(".rightCells") && !document.querySelector(".topCells")){
            constructGrid([10,10], leftGrid, "leftCells");
            constructGrid([10,10], rightGrid, "rightCells");
            constructGrid([3,20], topBar, "topCells");
        } 
        GameAudio.playBgMusic("stage", true, true);
        makePlayerReady();
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

    const placeEnemyShip = (cells, ships, shipPos, direction, shipName)=>{   
       placeShip(cells, ships, shipPos, direction, shipName, false);
    }
    const placePlayerShip = (cells, ships, shipPos, direction, shipName, allShipsPlaced)=>{   
       placeShip(cells, ships, shipPos, direction, shipName, true);
        ships.forEach(ship=>{
            if(shipName == ship.getAttribute("data-ship-type")){
                topShipUnavailable(ship);
            }
        })
        if(allShipsPlaced){
            document.querySelector("#readyGame").classList.add("active")
        }
        document.querySelector("#resetBoard").classList.add("active")
    }
    
    const placeShip = (cells, ships, shipPos, direction, shipName, viewable)=>{   
        cellsRemoveClass(cells, 10, shipPos, "validPlacement");
        ships.forEach(ship=>{
            if(shipName == ship.getAttribute("data-ship-type")){
                ship.style.display = "inline"
                ship.style.left = "calc(" + shipPos[0][0] + "*var(--cell-size) + 1px)"
                ship.style.top =  "calc(" + shipPos[0][1] + "*var(--cell-size) + 1px)"

                if(direction == "vertical"){
                    let rotateOffset = "(" + ship.getAttribute("data-width") + " * var(--cell-size)/2)"
                    ship.style.transformOrigin = "calc(" + rotateOffset+")";
                    ship.classList.add("verticalShip");
                }
                if(!viewable){
                    ship.style.display = "none"
                }
            }
        })
    }

    const resetBoard = ()=>{
        document.querySelector("#resetBoard").classList.remove("active");
        document.querySelector("#readyGame").classList.remove("active")
        let playerShips = document.querySelectorAll(".leftShips");
        playerShips.forEach(ship=>{
            ship.style.display = "none";
            ship.classList.remove("verticalShip");
            topShipAvailable(ship);
        })
        let rotateBtn = document.querySelector("#rotate");
        rotateBtn.classList.remove("vertical");
        rotateBtn.classList.add("horizontal")
    }
    const makeCpuReady = ()=>{
        document.querySelector("#gsLeft").classList.add("wait");
        document.querySelector("#gsRight").classList.remove("wait");
        document.querySelector("#rightGrid").classList.add("crosshair");
        document.querySelector("#rightGrid").classList.add("hoverable");
    }
    const makePlayerReady = ()=>{
        document.querySelector("#gsLeft").classList.remove("wait");
        document.querySelector("#gsRight").classList.add("wait");
    }
    const start = (character)=>{
        let readyGameBtn = document.querySelector("#readyGame");
        let resetBtn = document.querySelector("#resetBoard");
        readyGameBtn.classList.remove("active");
        resetBtn.classList.remove("active");
        readyGameBtn.style.display = "none";
        resetBtn.style.display = "none";
        GameAudio.playBgMusic("combat", true, true);
        GameAudio.playStartDialogue(character);
        makeCpuReady();
    }
    const hoverRightCell = (cell)=>{
        if(!cell.classList.contains("unhoverable") && document.querySelector("#rightGrid").classList.contains("hoverable")){
            cell.classList.add("hoverable");
        }
    }
    const unhoverRightCell = (cell)=>{
        if(cell.classList.contains("hoverable")){
            cell.classList.remove("hoverable");
        }
    }
    const receiveAttack = async (coords, attackStatus, reciever) => {
        let targetCell;
        let parsedCoords = '_' + coords[0] + '_' + coords[1];
        if (reciever == "cpu") {
            targetCell = document.querySelector("#rightGrid").querySelector("[data-coords=" + parsedCoords + "]");
            targetCell.classList.add("unhoverable");
            unhoverRightCell(targetCell);
        } else {
            targetCell = document.querySelector("#leftGrid").querySelector("[data-coords=" + parsedCoords + "]");
        }
    
        if (attackStatus == true) {
            targetCell.classList.add("hit");
        } else {
            targetCell.classList.add("miss");
        }
        if(reciever=="cpu"){
            document.querySelector("#gsLeft").classList.add("wait");
            document.querySelector("#rightGrid").classList.remove("crosshair") // set the cursor to default
            document.querySelector("#rightGrid").classList.remove("hoverable") // remove cell hover effect
            await GameAudio.attackEffects(attackStatus);
            makePlayerReady();

        }else{
            document.querySelector("#gsRight").classList.add("wait");
            await GameAudio.attackEffects(attackStatus);
            makeCpuReady();
        }

    }
    const showSunkenEnemy = (sunkenShipName, rightCells, cpuShips, shipObj)=>{
        placeEnemyShip(rightCells, cpuShips, shipObj.coordinates, shipObj.direction, sunkenShipName, true);
        let rightContainer = document.querySelector("#rightBoardContainer")
        rightContainer.querySelector("[data-ship-type=" + sunkenShipName + "]").style.display = "inline";
    }
    const restartGame = ()=>{
        let readyGameBtn = document.querySelector("#readyGame");
        let resetBtn = document.querySelector("#resetBoard");
        readyGameBtn.classList.remove("active");
        resetBtn.classList.remove("active");
        readyGameBtn.style.display = "inline";
        resetBtn.style.display = "inline";
        resetBoard();
        let rightCells = document.querySelectorAll(".rightCells");
        let leftCells = document.querySelectorAll(".leftCells");
        rightCells.forEach(cell=>{
            cell.classList.remove("hit");
            cell.classList.remove("miss");
            cell.classList.remove("unhoverable");
        });
        leftCells.forEach(cell=>{
            cell.classList.remove("hit");
            cell.classList.remove("miss");
        });
        makePlayerReady();
        document.querySelector("#rightGrid").classList.remove("crosshair") // return to default cursor
        document.querySelector("#rightGrid").classList.remove("hoverable") // remove cell hover effect

        let rightContainer = document.querySelector("#rightBoardContainer")
        shipNames.forEach(name=>{
            let ship = rightContainer.querySelector("[data-ship-type=" + name + "]")
            ship.style.display = "none";
            ship.classList.remove("verticalShip");
        })
        GameAudio.playBgMusic("stage", true, true);
        
    }
    const gameOverScreen = async (character, winner)=>{
        // Get the modal element
        if(winner == "cpu"){
            document.querySelector("#resultsModalHeading").textContent = "DEFEAT"
            await GameAudio.playEndDialogue(character, false);
            GameAudio.playBgMusic("lose", false, true);
        }else{
            document.querySelector("#resultsModalHeading").textContent = "VICTORY"
            await GameAudio.playEndDialogue(character, true);
            GameAudio.playBgMusic("victory", false, true);
        }
        const gameOverModal = new bootstrap.Modal(document.getElementById('resultsModal'));
        gameOverModal.show();
    }
    const changeToMainMenu = ()=>{
        restartGame();
        document.querySelector("#content").style.display = "flex";
        document.querySelector("#gameScreen").style.display = "none";
        document.querySelector("#gsBackground").style.display = "none";
        let button = document.getElementById('volBtn');
        if(button.classList.contains("on")){
            GameAudio.playBgMusic("menu", true, true);
        }
    }
    const showAudioModal = ()=>{
        const audioModal = new bootstrap.Modal(document.getElementById('audioModal'));
        audioModal.show();
    }
    const setMute = (isMute)=>{
        if (!isMute){
            toggleMenuMusic();
        }
    }
    return {showAudioModal,
        setMute,
        fadeIn, 
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
        placeEnemyShip,
        placePlayerShip,
        resetBoard,
        hoverRightCell,
        unhoverRightCell,
        receiveAttack,
        showSunkenEnemy,
        gameOverScreen,
        restartGame,
        changeToMainMenu,
        start,
    }
})();

export default View;