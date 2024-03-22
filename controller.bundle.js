/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gsStyles.css":
/*!**************************!*\
  !*** ./src/gsStyles.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/model.js":
/*!**********************!*\
  !*** ./src/model.js ***!
  \**********************/
/***/ ((module) => {

function Ship(length, width, id, status){
    let shipStatus = status;
    let totalHits = 0;
    const isSunk = ()=>{
        return totalHits === length * width
    }
    const hit = ()=>{
        if(!isSunk()){
            totalHits++;
        }
        return totalHits;
    }
    const getLength = ()=>{return length}
    const getWidth = ()=>{ return width};
    const getId = ()=>{return id};
    const getStatus = ()=>{ return shipStatus};
    const setStatus = (stat) =>{
        shipStatus = stat;
    }
    const resetHits = ()=>{
        totalHits = 0;
    }
    return {getLength, getWidth, getId, getStatus, setStatus, hit, isSunk, resetHits};
}

function Gameboard(){
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    const rangeMax = 9;
    const rangeMin = 0;
    const Status = {"undeployed": 0,
                    "deployed": 1,
                    "sunk": -1
    };
    const Cells = {"empty": 0,
                   "hit": '*',
                   "miss": '/',
                   "ca": 1,
                   "ba": 2,
                   "cr": 3,
                   "su": 4,
                   "de": 5
    };

    let carrier = Ship(5,2, Cells.ca, Status.undeployed);
    let battleship = Ship(4,2, Cells.ba, Status.undeployed);
    let cruiser = Ship(3,1, Cells.cr, Status.undeployed);
    let submarine = Ship(3,1, Cells.su, Status.undeployed);
    let destroyer = Ship(2,1, Cells.de, Status.undeployed);

    const Fleet = {"Carrier":{"ship": carrier, "coordinates": [], "direction": ""}, 
                   "Battleship":{"ship": battleship, "coordinates": [], "direction": ""}, 
                   "Cruiser":{"ship": cruiser, "coordinates": [], "direction": ""}, 
                   "Submarine":{"ship": submarine, "coordinates": [], "direction": ""}, 
                   "Destroyer":{"ship": destroyer, "coordinates": [], "direction": ""}
    };

    let gameBoard = [];

    // 0 for empty space, 1 for space occupied by a ship.
    const initBoard = ()=>{    
        for (let i = 0; i < 10; i++) {
            gameBoard[i] = [];
            for (let j = 0; j < 10; j++) {
                gameBoard[i][j] = Cells.empty;
            }
        }
    }
    initBoard();
    const resetBoard = ()=>{
        initBoard();
        for(let shipName in Fleet){
            Fleet[shipName].ship.setStatus(Status.undeployed);
            Fleet[shipName].ship.resetHits();
            Fleet[shipName].coordinates = [];
            Fleet[shipName].direction = ""
        }
    }

    const updateBoard = (x, y, newCell)=>{
        gameBoard[y][x] = newCell;
    }

    const coordBounds = (midCoord, direction, shipLength)=>{
        let startCoord;
        let endCoord;
        const distToMid = Math.floor(shipLength/2);
        let evenLengthOffset = 0;
        if(shipLength % 2 == 0){
            evenLengthOffset = 1;
        }
        if(direction == Horizontal){
            startCoord = [midCoord[0] - distToMid + evenLengthOffset, midCoord[1]];
            endCoord = [midCoord[0] + distToMid, midCoord[1]];
        }else if(direction == Vertical){
            startCoord = [midCoord[0], midCoord[1] - distToMid + evenLengthOffset];
            endCoord = [midCoord[0], midCoord[1] + distToMid];
        }
        return {startCoord, endCoord};
    }

    const isWithinBounds = (coord)=>{
        if(coord[0] < rangeMin || coord[0] > rangeMax || coord[1] < rangeMin || coord[1] > rangeMax){
            // console.log("invalid coords, out of bounds");
            return false;
        }
        return true;
    }
    const getOutOfBoundCoords = (coords)=>{
        let invalidCoordinates = [];
        coords.forEach(coord => {
            if(!isWithinBounds(coord)){
                invalidCoordinates.push(coord);
            }
        });
        return invalidCoordinates;
    }

    const isSpaceEmpty = (direction, startCoord, length)=>{
        let x = startCoord[0];
        let y = startCoord[1];
        const Ids = [Cells.ca, Cells.ba, Cells.cr, Cells.su, Cells.de];
        for(let i=0; i<length; i++){
            if(Ids.includes(gameBoard[y][x])){
                // console.log("invalid coords, collision detected")
                return false;
            }
            direction === Horizontal ? x++ : y++;
        }
        return true;
    }

    const isPlacementValid = (midCoord, direction, shipName)=>{
        if(!isShipValid(shipName)){
            return false;
        }
        let shipLength = Fleet[shipName].ship.getLength();
        let shipWidth = Fleet[shipName].ship.getWidth();
        let midX = midCoord[0];
        let midY = midCoord[1];
        for(let i=0; i<shipWidth; i++){
            const {startCoord, endCoord} = coordBounds([midX,midY], direction, shipLength);
            if(!(isWithinBounds(startCoord) && isWithinBounds(endCoord) && isSpaceEmpty(direction, startCoord, shipLength))){
                return false;
            }
            direction === Horizontal ? midY++ : midX++;
        }
        return true;
    }

    const isShipValid =(shipName)=>{
        let shipObj = Fleet[shipName];
        if(!shipObj){
            // console.log("error, incorrect ship name")
            return false;
        }
        if(shipObj.ship.getStatus() != Status.undeployed){
            // console.log("can not place an already deployed or sunk ship");
            return false;
        }
        return true;
    }

    const getPlacement = (midCoord, direction, shipName)=>{
        let ship = Fleet[shipName].ship;
        let shipCoordinates = [];
        let shipwidth = ship.getWidth();
        let shipLength = ship.getLength();
        let midX = midCoord[0];
        let midY = midCoord[1];
        for(let i=0; i<shipwidth; i++){
            const {startCoord, endCoord} = coordBounds([midX, midY], direction, shipLength);
            let x = startCoord[0];
            let y = startCoord[1];
            for(let j=0; j<shipLength; j++){
                shipCoordinates.push([x,y]);
                direction === Horizontal ? x++ : y++;
            }
            direction === Horizontal ? midY++ : midX++;
        }
        return shipCoordinates;
    }

    const placeShip = (midCoord, direction, shipName)=>{
        let shipObj = Fleet[shipName];
        if(!isPlacementValid(midCoord, direction, shipName)){
            return false;
        }
        let shipCoordinates = getPlacement(midCoord, direction, shipName);
        shipObj.coordinates = shipCoordinates;
        shipObj.direction = direction;
        shipCoordinates.forEach(coord => {
            const x = coord[0];
            const y = coord[1];
            updateBoard(x, y, shipObj.ship.getId());
        });
        shipObj.ship.setStatus(Status.deployed);
        return true;
    }
    const areShipsOnBoard = ()=>{
        let check = true;
        Object.keys(Fleet).forEach(shipName => {
            if(Fleet[shipName].ship.getStatus() === Status.undeployed){
                check = false;
            }
        });
        // if(!check){console.log("all ships are not deployed yet")}
        return check;
    }
    const shipsSunk = ()=>{
        if(!areShipsOnBoard()){
            return false;
        }
        let check = true;
        Object.keys(Fleet).forEach(shipName => {
            if(Fleet[shipName].ship.getStatus() !== Status.sunk){
                check = false;
            }
        });
        return check;

    }
    const getSunken = ()=>{
        let sunkenShips = [];
        if(!areShipsOnBoard()){
            return sunkenShips;
        }
        Object.keys(Fleet).forEach(shipName => {
            if(Fleet[shipName].ship.getStatus() == Status.sunk){
                sunkenShips.push(shipName);
            }
        });
        return sunkenShips;

    }
    const isAttackValid = (coord)=>{
        let x = coord[0];
        let y = coord[1];
        const validCells = [Cells.empty, Cells.ca, Cells.ba, Cells.cr, Cells.su, Cells.de];
        // invalid cells would be [Cells.hit, Cells.miss]
        // if coord is found in validCells, attack is not repeated and valid, 
        // else cell at this coord would either have been a hit or a miss (invalid).
        if(validCells.includes(gameBoard[y][x])){
            //in order for attack to proceed all ships must be deployed and coords within bounds.
            return (isWithinBounds(coord) && areShipsOnBoard())
        }
        return false;
    }
    const getShipObjById = (id)=>{
        let shipObj = undefined;
        Object.keys(Fleet).forEach(shipName => {
            if(Fleet[shipName].ship.getId() == id){
                shipObj = Fleet[shipName];
            }
        });
        return shipObj;
    }
    //attack can only proceed if all ships are deployed, coords are within bounds and not used previously for another attack.
    //attack is a hit if ship exists on coords, else, it's a miss.
    //if hit, update hits on the corresponding ship
    //update board on both hit and miss
    //return true if hit, false if miss, undefined otherwise.
    const receiveAttack = (coord)=>{
        if(!isAttackValid(coord)){
            return undefined;
        }
        let x = coord[0];
        let y = coord[1];
        const ids = [Cells.ca, Cells.ba, Cells.cr, Cells.su, Cells.de];

        //if hit
        if(ids.includes(gameBoard[y][x])){
            let ship = getShipObjById(gameBoard[y][x]).ship;
            ship.hit();
            updateBoard(x,y,Cells.hit);
            if(ship.isSunk()){
                ship.setStatus(Status.sunk);
            }
            return true;
     
        }

        //miss otherwise
        updateBoard(x,y,Cells.miss);
        return false;
    }
    const getFleet = ()=>{
        return Fleet;
    }
    const logBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            let row = '';
            for (let j = 0; j < gameBoard[i].length; j++) {
                row += gameBoard[i][j] + " ";
            }
            console.log(row);
        }
    }
    const sinkShips = ()=>{
        let check = true;
        Object.keys(Fleet).forEach(shipName => {
            Fleet[shipName].ship.setStatus(Status.sunk);
        });
    }

    return {getPlacement,
            isPlacementValid, 
            placeShip, 
            receiveAttack,
            getOutOfBoundCoords,
            areShipsOnBoard,
            getFleet,
            getSunken,
            shipsSunk,
            sinkShips,
            resetBoard,
            logBoard};
}

function Player(){
    let board = Gameboard();
    const placeShip = (coords, direction, shipName)=>{
        return board.placeShip(coords, direction, shipName);
    }
    const getPlacementCoords = (coords, direction, shipName)=>{
        let placementCoords = board.getPlacement(coords, direction, shipName);
        let outOfBoundCoords = board.getOutOfBoundCoords(placementCoords);
        let uniqueCoords = placementCoords.filter(coord => !outOfBoundCoords.includes(coord)); //intersection of the two coordinate arrays.
        return uniqueCoords;
    }
    const checkPlacement = (coords, direction, shipName)=>{
        return board.isPlacementValid(coords, direction, shipName);
    }
    const receiveAttack = (coords)=>{
        return board.receiveAttack(coords);
    }
    const resetBoard = ()=>{
        board.resetBoard();
    }
    const areShipsOnBoard = ()=>{
        return board.areShipsOnBoard();
    }
    const getFleet = ()=>{
        return board.getFleet();
    }
    const getSunken = ()=>{
        return board.getSunken();
    }
    const areShipsSunk = ()=>{
        return board.shipsSunk();
    }
    const sinkShips = ()=>{
        return board.sinkShips();
    }
    const logBoard = ()=>{
        return board.logBoard();
    }
    return{placeShip, 
        getPlacementCoords, 
        checkPlacement, 
        areShipsOnBoard, 
        receiveAttack,
        getFleet,
        getSunken,
        resetBoard,
        areShipsSunk,
        sinkShips,
        logBoard,
    };
} 

function Computer(){
    let cpu = Player();
    let availableCoords;
    let hits;
    const validRange = [0,1,2,3,4,5,6,7,8,9];
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    let shipNames = [];
    let allEnemySunk = [];

    const init = ()=>{
        availableCoords = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                availableCoords.push([i,j]);
            }
        }
        hits = [];
        allEnemySunk = [];
        shipNames = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];
    }
    init();

    const pickRandomFromArray = (array)=>{
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
    const placeShip = ()=>{
        let check = true;
        while(check){
            let x = pickRandomFromArray(validRange);
            let y = pickRandomFromArray(validRange);
            let direction = pickRandomFromArray([Horizontal, Vertical]);
            let shipName = pickRandomFromArray(shipNames);
            if(cpu.checkPlacement([x,y], direction, shipName)){
                cpu.placeShip([x,y], direction, shipName);
                shipNames = shipNames.filter(item => item !== shipName);
                check = false;
            }
        }
    }
    const placeShips = ()=>{
        while(cpu.areShipsOnBoard() != true){
            placeShip();
        }
    }
    const getFleet = ()=>{
        return cpu.getFleet();
    }
    const receiveAttack = (coords)=>{
        return cpu.receiveAttack(coords);
    }
    const getSunken = ()=>{
        return cpu.getSunken();
    }

    //get next move cosnidering last move
    const getNextMove = (hits)=>{
        while(true){
            let validHit = hits.find(hit => !hit.isExhausted);
            if (!validHit) {
                console.error("All hits exhausted");
            }
            let lastHit = validHit.hitCoords;
            let lastDirection = validHit.hitDirection;
            let nextMoves = {"right":[lastHit[0]+1,lastHit[1]],
                            "up":[lastHit[0],lastHit[1]-1],
                            "left":[lastHit[0]-1,lastHit[1]],
                            "down":[lastHit[0],lastHit[1]+1],
            }
            // prioritize moving in the direction of the last successful move
            // lastDirection essentially acts as a single move history
            if(availableCoords.some(coord => JSON.stringify(coord) === JSON.stringify(nextMoves[lastDirection]))){
                return [nextMoves[lastDirection], lastDirection];
            }
            else{
                for(let moveDirection in nextMoves){
                    if(availableCoords.find(coord => JSON.stringify(coord) === JSON.stringify(nextMoves[moveDirection]))){
                        return [nextMoves[moveDirection], moveDirection];
                    }
                }
            }
            validHit.isExhausted = true //all possible paths from last valid hit lead to missed shots
        }
    }

    const makeMove = (playerObj)=>{
        let newMove;
        let index;
        let direction = "right"; //default direction of a new move
        //if no ship has been struck yet, pick a random coord.
        if(hits.length == 0){
            index = Math.floor(Math.random() * availableCoords.length);
            newMove = availableCoords[index];
            availableCoords.splice(index, 1);
        }
        else{ // if ship has been hit previously, find the next possible move from lastHit.
            lastHit = hits[0].hitCoords;
            lastDirection = hits[0].hitDirection;
            [newMove, direction] = getNextMove(hits);
            index = availableCoords.findIndex(coord => coord[0] === newMove[0] && coord[1] === newMove[1]);
            if (index !== -1) {
                availableCoords.splice(index, 1);
            }
        }

        let attackStatus = playerObj.receiveAttack([newMove[0], newMove[1]]);
        if(attackStatus){ //if attack hit a ship
            let hitObj = {"hitCoords": [newMove[0], newMove[1]], "hitDirection":direction, "isExhausted":false};
            hits.unshift(hitObj);
            let updatedSunken = playerObj.getSunken();
            let sunkenShipName = updatedSunken.find(item => !allEnemySunk.includes(item));
            if(sunkenShipName){ // if hit caused a ship to sink.
                allEnemySunk = updatedSunken;
                const fleet = playerObj.getFleet();
                const shipObj = fleet[sunkenShipName];
                let removeNumberOfMoves = shipObj.coordinates.length;
                hits.splice(0, removeNumberOfMoves);
            }
        }
        return [newMove, attackStatus];

    }
    const addToHit = (coords, playerObj)=>{
        playerObj.receiveAttack([coords[0], coords[1]]);
        let hitObj = {"hitCoords": [coords[0], coords[1]], "hitDirection":"right", "isExhausted":false};
        hits.unshift(hitObj);
        index = availableCoords.findIndex(coord => coord[0] === coords[0] && coord[1] === coords[1]);
        if (index !== -1) {
            availableCoords.splice(index, 1);
        }
    }
    const sinkShips = ()=>{
        return cpu.sinkShips();
    }
    const areShipsSunk = ()=>{
        return cpu.areShipsSunk();
    }
    const resetBoard = ()=>{
        init();
        return cpu.resetBoard();
    }
    return{placeShips, receiveAttack, getFleet, getSunken, makeMove, addToHit, areShipsSunk, sinkShips,resetBoard,};
}

// let player1 = Player();
// player1.placeShip([2,3], "vertical", "Carrier")
// player1.placeShip([5,8], "horizontal", "Battleship")
// player1.placeShip([1,7], "vertical", "Submarine")
// player1.placeShip([4,0], "horizontal", "Cruiser")
// player1.placeShip([5,5], "horizontal", "Destroyer")
// player1.board.logBoard();
// let cpu = Computer();
// cpu.placeShips();
// cpu.addToHit([3,1], player1);

module.exports = {Ship, Gameboard, Player, Computer};

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assets_menu_volume_high_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/menu/volume-high.svg */ "./src/assets/menu/volume-high.svg");
/* harmony import */ var _assets_menu_volume_off_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/menu/volume-off.svg */ "./src/assets/menu/volume-off.svg");
/* harmony import */ var _assets_characters_pidle2_gif__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/characters/pidle2.gif */ "./src/assets/characters/pidle2.gif");
/* harmony import */ var _assets_characters_vikingIdle_gif__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/characters/vikingIdle.gif */ "./src/assets/characters/vikingIdle.gif");
/* harmony import */ var _assets_sounds_GameMusic_Menu_wav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets/sounds/GameMusic/Menu.wav */ "./src/assets/sounds/GameMusic/Menu.wav");
/* harmony import */ var _assets_sounds_GameMusic_Level_wav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assets/sounds/GameMusic/Level.wav */ "./src/assets/sounds/GameMusic/Level.wav");
/* harmony import */ var _assets_sounds_GameMusic_Combat_wav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./assets/sounds/GameMusic/Combat.wav */ "./src/assets/sounds/GameMusic/Combat.wav");
/* harmony import */ var _assets_sounds_GameMusic_hit_wav__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./assets/sounds/GameMusic/hit.wav */ "./src/assets/sounds/GameMusic/hit.wav");
/* harmony import */ var _assets_sounds_GameMusic_miss_wav__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./assets/sounds/GameMusic/miss.wav */ "./src/assets/sounds/GameMusic/miss.wav");
/* harmony import */ var _assets_sounds_GameMusic_victory_wav__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./assets/sounds/GameMusic/victory.wav */ "./src/assets/sounds/GameMusic/victory.wav");
/* harmony import */ var _assets_sounds_GameMusic_lose_wav__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./assets/sounds/GameMusic/lose.wav */ "./src/assets/sounds/GameMusic/lose.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_sheildTosheild_wav__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/sheildTosheild.wav */ "./src/assets/sounds/VikingDialogue/sheildTosheild.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_thorJudge_wav__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/thorJudge.wav */ "./src/assets/sounds/VikingDialogue/thorJudge.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_valhallaAdmits_wav__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/valhallaAdmits.wav */ "./src/assets/sounds/VikingDialogue/valhallaAdmits.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_leaveMe_wav__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/leaveMe.wav */ "./src/assets/sounds/VikingDialogue/leaveMe.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_toArms_wav__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/toArms.wav */ "./src/assets/sounds/VikingDialogue/toArms.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_notPossible_wav__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/notPossible.wav */ "./src/assets/sounds/VikingDialogue/notPossible.wav");
/* harmony import */ var _assets_sounds_VikingDialogue_goldCanBuy_wav__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./assets/sounds/VikingDialogue/goldCanBuy.wav */ "./src/assets/sounds/VikingDialogue/goldCanBuy.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_allHands1_wav__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/allHands1.wav */ "./src/assets/sounds/PirateDialogue/allHands1.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_fireInTheHole_wav__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/fireInTheHole.wav */ "./src/assets/sounds/PirateDialogue/fireInTheHole.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_walkThePlank_wav__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/walkThePlank.wav */ "./src/assets/sounds/PirateDialogue/walkThePlank.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_battenHatches_wav__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/battenHatches.wav */ "./src/assets/sounds/PirateDialogue/battenHatches.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_hoistJelly_wav__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/hoistJelly.wav */ "./src/assets/sounds/PirateDialogue/hoistJelly.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_abandon_wav__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/abandon.wav */ "./src/assets/sounds/PirateDialogue/abandon.wav");
/* harmony import */ var _assets_sounds_PirateDialogue_deadMan_wav__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./assets/sounds/PirateDialogue/deadMan.wav */ "./src/assets/sounds/PirateDialogue/deadMan.wav");






























const GameAudio = (function(){
    let mute = true;
    const menu = new Audio(_assets_sounds_GameMusic_Menu_wav__WEBPACK_IMPORTED_MODULE_4__);
    const stage = new Audio(_assets_sounds_GameMusic_Level_wav__WEBPACK_IMPORTED_MODULE_5__);
    const combat = new Audio(_assets_sounds_GameMusic_Combat_wav__WEBPACK_IMPORTED_MODULE_6__);
    const hit = new Audio(_assets_sounds_GameMusic_hit_wav__WEBPACK_IMPORTED_MODULE_7__); 
    const miss = new Audio(_assets_sounds_GameMusic_miss_wav__WEBPACK_IMPORTED_MODULE_8__);
    const victory = new Audio(_assets_sounds_GameMusic_victory_wav__WEBPACK_IMPORTED_MODULE_9__);
    const lose = new Audio(_assets_sounds_GameMusic_lose_wav__WEBPACK_IMPORTED_MODULE_10__);
    menu.volume = 0.7;
    combat.volume = 0.5;

    const V_SelectD1 = new Audio(_assets_sounds_VikingDialogue_sheildTosheild_wav__WEBPACK_IMPORTED_MODULE_11__);
    const V_SelectD2 = new Audio(_assets_sounds_VikingDialogue_thorJudge_wav__WEBPACK_IMPORTED_MODULE_12__);
    const V_SelectD3 = new Audio(_assets_sounds_VikingDialogue_valhallaAdmits_wav__WEBPACK_IMPORTED_MODULE_13__);
    const V_SelectD4 = new Audio(_assets_sounds_VikingDialogue_leaveMe_wav__WEBPACK_IMPORTED_MODULE_14__);

    const P_SelectD1 = new Audio(_assets_sounds_PirateDialogue_allHands1_wav__WEBPACK_IMPORTED_MODULE_18__);
    const P_SelectD2 = new Audio(_assets_sounds_PirateDialogue_fireInTheHole_wav__WEBPACK_IMPORTED_MODULE_19__);
    const P_SelectD3 = new Audio(_assets_sounds_PirateDialogue_walkThePlank_wav__WEBPACK_IMPORTED_MODULE_20__);
    const P_SelectD4 = new Audio(_assets_sounds_PirateDialogue_battenHatches_wav__WEBPACK_IMPORTED_MODULE_21__);

    const V_Start = new Audio(_assets_sounds_VikingDialogue_toArms_wav__WEBPACK_IMPORTED_MODULE_15__);
    const P_Start = new Audio(_assets_sounds_PirateDialogue_hoistJelly_wav__WEBPACK_IMPORTED_MODULE_22__);

    const P_Lose = new Audio(_assets_sounds_PirateDialogue_abandon_wav__WEBPACK_IMPORTED_MODULE_23__);
    const P_Win = new Audio(_assets_sounds_PirateDialogue_deadMan_wav__WEBPACK_IMPORTED_MODULE_24__)
    const V_Lose = new Audio(_assets_sounds_VikingDialogue_notPossible_wav__WEBPACK_IMPORTED_MODULE_16__);
    const V_Win = new Audio(_assets_sounds_VikingDialogue_goldCanBuy_wav__WEBPACK_IMPORTED_MODULE_17__);

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
            img.src = _assets_menu_volume_high_svg__WEBPACK_IMPORTED_MODULE_0__;
            button.classList = [];
            button.classList.add("on");
        }else{
            GameAudio.isAudioAllowed(false);
            GameAudio.stopBgMusic("menu");
            img.src = _assets_menu_volume_off_svg__WEBPACK_IMPORTED_MODULE_1__;
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
            playerImg.src = _assets_characters_vikingIdle_gif__WEBPACK_IMPORTED_MODULE_3__;
            oppImg.src = _assets_characters_pidle2_gif__WEBPACK_IMPORTED_MODULE_2__;
        }else{
            playerImg.src = _assets_characters_pidle2_gif__WEBPACK_IMPORTED_MODULE_2__;
            oppImg.src = _assets_characters_vikingIdle_gif__WEBPACK_IMPORTED_MODULE_3__;
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);

/***/ }),

/***/ "./src/assets/characters/pidle2.gif":
/*!******************************************!*\
  !*** ./src/assets/characters/pidle2.gif ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/pidle2.gif";

/***/ }),

/***/ "./src/assets/characters/vikingIdle.gif":
/*!**********************************************!*\
  !*** ./src/assets/characters/vikingIdle.gif ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/vikingIdle.gif";

/***/ }),

/***/ "./src/assets/menu/volume-high.svg":
/*!*****************************************!*\
  !*** ./src/assets/menu/volume-high.svg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/volume-high.svg";

/***/ }),

/***/ "./src/assets/menu/volume-off.svg":
/*!****************************************!*\
  !*** ./src/assets/menu/volume-off.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/volume-off.svg";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/Combat.wav":
/*!************************************************!*\
  !*** ./src/assets/sounds/GameMusic/Combat.wav ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/Combat.wav";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/Level.wav":
/*!***********************************************!*\
  !*** ./src/assets/sounds/GameMusic/Level.wav ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/Level.wav";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/Menu.wav":
/*!**********************************************!*\
  !*** ./src/assets/sounds/GameMusic/Menu.wav ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/Menu.wav";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/hit.wav":
/*!*********************************************!*\
  !*** ./src/assets/sounds/GameMusic/hit.wav ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/hit.wav";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/lose.wav":
/*!**********************************************!*\
  !*** ./src/assets/sounds/GameMusic/lose.wav ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/lose.wav";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/miss.wav":
/*!**********************************************!*\
  !*** ./src/assets/sounds/GameMusic/miss.wav ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/miss.wav";

/***/ }),

/***/ "./src/assets/sounds/GameMusic/victory.wav":
/*!*************************************************!*\
  !*** ./src/assets/sounds/GameMusic/victory.wav ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/victory.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/abandon.wav":
/*!******************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/abandon.wav ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/abandon.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/allHands1.wav":
/*!********************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/allHands1.wav ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/allHands1.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/battenHatches.wav":
/*!************************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/battenHatches.wav ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/battenHatches.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/deadMan.wav":
/*!******************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/deadMan.wav ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/deadMan.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/fireInTheHole.wav":
/*!************************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/fireInTheHole.wav ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/fireInTheHole.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/hoistJelly.wav":
/*!*********************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/hoistJelly.wav ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/hoistJelly.wav";

/***/ }),

/***/ "./src/assets/sounds/PirateDialogue/walkThePlank.wav":
/*!***********************************************************!*\
  !*** ./src/assets/sounds/PirateDialogue/walkThePlank.wav ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/walkThePlank.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/goldCanBuy.wav":
/*!*********************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/goldCanBuy.wav ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/goldCanBuy.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/leaveMe.wav":
/*!******************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/leaveMe.wav ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/leaveMe.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/notPossible.wav":
/*!**********************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/notPossible.wav ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/notPossible.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/sheildTosheild.wav":
/*!*************************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/sheildTosheild.wav ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/sheildTosheild.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/thorJudge.wav":
/*!********************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/thorJudge.wav ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/thorJudge.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/toArms.wav":
/*!*****************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/toArms.wav ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/toArms.wav";

/***/ }),

/***/ "./src/assets/sounds/VikingDialogue/valhallaAdmits.wav":
/*!*************************************************************!*\
  !*** ./src/assets/sounds/VikingDialogue/valhallaAdmits.wav ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/valhallaAdmits.wav";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _gsStyles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gsStyles.css */ "./src/gsStyles.css");
/* harmony import */ var _model_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model.js */ "./src/model.js");
/* harmony import */ var _model_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_model_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view.js */ "./src/view.js");





const Controller = (function() {
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    let characterSelected;
    let shipSelected;
    let direction = Horizontal;
    let player1 = (0,_model_js__WEBPACK_IMPORTED_MODULE_2__.Player)();
    let cpu = (0,_model_js__WEBPACK_IMPORTED_MODULE_2__.Computer)();
    let turn = 1;
    let gameStart = false;

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
        player1.resetBoard();
        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].resetBoard();
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
    const checkGameOver = async (actor)=>{ 
        let actorWon = false;
        if(actor == "cpu"){
            if(player1.areShipsSunk() == true){
                actorWon = true;
            }
        }else{
            if(cpu.areShipsSunk() == true){
                actorWon = true
            }
        }
        if(actorWon){
            await _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].gameOverScreen(getCharacter(),actor);
        }
        return actorWon;
    }
    const cpuMove = async ()=>{
        let [coords, attackStatus] = cpu.makeMove(player1);
        await new Promise(resolve => setTimeout(resolve, 750));
        await _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].receiveAttack(coords, attackStatus, "player");
        await checkGameOver("cpu");
        changeTurn();
    }
    const playerMove = async (e)=>{
        if(getTurn() == "Player"){
            let coords = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/).map(Number);
            if (coords) {
                coords = coords.slice(1).map(Number);
            }
            let attackStatus = cpu.receiveAttack(coords);
            if(attackStatus != undefined){
                changeTurn();
                await _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].receiveAttack(coords, attackStatus, "cpu");
                new Promise(resolve => setTimeout(resolve, 500));
                let rightCells = document.querySelectorAll(".rightCells");
                let cpuShips = document.querySelectorAll(".rightShips");    
                if(attackStatus == true){
                    let sunkenShips = cpu.getSunken();
                    let cpuFleet = cpu.getFleet();
                    sunkenShips.forEach(sunkenShipName =>{
                        let shipObj = cpuFleet[sunkenShipName];
                        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].showSunkenEnemy(sunkenShipName, rightCells, cpuShips, shipObj);
                    })
                }
                const isGameOver = await checkGameOver("player");
                if(!isGameOver){
                    cpuMove();
                }else{
                    let cpuFleet = cpu.getFleet();
                    for(let shipName in cpuFleet){
                        let shipObj = cpuFleet[shipName];
                        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].showSunkenEnemy(shipName, rightCells, cpuShips, shipObj);
                    }
                }
            }
        }
    }
    const restartGame = ()=>{
        resetBoard();
        player1.resetBoard();
        cpu.resetBoard();
        turn = 1;
        gameStart = false;
        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].restartGame();
    }
    const endGame = ()=>{
        restartGame();
        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].changeToMainMenu();
    }
    const init = ()=>{
        const flagGif = document.getElementById('flag');
        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].fadeIn(flagGif, 500);

        const volumeButton = document.getElementById('volBtn');
        volumeButton.addEventListener('click', (e)=>{
            _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].toggleMenuMusic();
        })
    
        const characterButtons = document.querySelectorAll(".select");
        characterButtons.forEach(button => {
            button.addEventListener('click', (e)=>{
                _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].selectCharacter(e.target);
                setCharacter(e.target.id);
            })
        })
    
        const closeModalBtn = document.querySelector("#closeModal");
        closeModalBtn.addEventListener('click', _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].resetSelectScreen);
    
        const modal = document.querySelector('#modal');
        modal.addEventListener('click', function(event) {
            let isClickInsideModal = document.querySelector('.modal-content').contains(event.target);
            if (!isClickInsideModal) {
               _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].resetSelectScreen();
            }
        });
        const startBrn = document.querySelector('#startGame');
        startBrn.addEventListener("click", function(event) {
            if(event.target.classList.contains("active")){
                _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].changeToGameScreen(getCharacter());
            }
        });
        let topShips = document.querySelectorAll(".topShips");
        topShips.forEach(ship =>{
            ship.addEventListener("mouseenter", function(event){
                _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].topShipsHover(event.target.id);
            })
            ship.addEventListener("mouseleave", function(event){
                _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].topShipsDefault(event.target.id);
            })
            ship.addEventListener("click", function(e){
                let selectable = _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].topShipSelected(e.target.id);
                if(selectable){
                    setShip(e.target.getAttribute("data-ship-type"));
                }
            })
        })
        let unselectShip = document.querySelector("#cancel");
        let rotateShip = document.querySelector("#rotate");
        unselectShip.addEventListener("click", function(e){
            _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].unselectShips();
            setShip(null);
        })
        rotateShip.addEventListener("click", function(e){
            if(getShip() != null){
                _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].triggerRotation(e.target, getDirection());
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
                resetBoard();
            }
        })

        let readyGameBtn = document.querySelector("#readyGame");
        readyGameBtn.addEventListener("click", function(e){
            if(e.target.classList.contains("active")){
                cpu.placeShips();
                _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].start(getCharacter());
                gameStart = true;
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
                        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].colorPlacement(coordinates, isValidPlacement);
                    }
                })
                cell.addEventListener("mouseleave", function(e){
                    if(getShip() != null){
                        let [, x, y] = e.target.getAttribute("data-coords").match(/_(\d+)_(\d+)/);
                        let coordinates = player1.getPlacementCoords([x,y], getDirection(), getShip());
                        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].uncolorPlacement(coordinates);
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
                            _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].placePlayerShip(leftCells, playerShips, coordinates, getDirection(), getShip(), allShipsPlaced);
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
                    if(gameStart){
                        _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].hoverRightCell(e.target);
                    }
                })
                cell.addEventListener("mouseleave", function(e){
                    _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].unhoverRightCell(e.target);
                })
                cell.addEventListener("click", playerMove)
            })
        })

        let restartButton = document.querySelector("#restartGame");
        restartButton.addEventListener("click", restartGame)

        let mainMenuButton = document.querySelector("#mainMenu");
        mainMenuButton.addEventListener("click",  endGame);
    }

    return{init, getCharacter, getDirection, setDirection, setShip, getShip};
})();

document.addEventListener('DOMContentLoaded', function() {
    let unmuteBtn = document.querySelector("#unmute");
    unmuteBtn.addEventListener("click", _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].toggleMenuMusic);
    _view_js__WEBPACK_IMPORTED_MODULE_3__["default"].showAudioModal();
    Controller.init();
});




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw4REFBUztBQUNyQyx5QkFBeUIsMERBQVM7QUFDbEMsU0FBUztBQUNULDRCQUE0QiwwREFBUztBQUNyQyx5QkFBeUIsOERBQVM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQSxXQUFXO0FBQ1gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxnREFBSTtBQUM1QyxJQUFJLGdEQUFJO0FBQ1I7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nc1N0eWxlcy5jc3M/MTkyNyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy5jc3M/MTU1MyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZGVsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZnVuY3Rpb24gU2hpcChsZW5ndGgsIHdpZHRoLCBpZCwgc3RhdHVzKXtcclxuICAgIGxldCBzaGlwU3RhdHVzID0gc3RhdHVzO1xyXG4gICAgbGV0IHRvdGFsSGl0cyA9IDA7XHJcbiAgICBjb25zdCBpc1N1bmsgPSAoKT0+e1xyXG4gICAgICAgIHJldHVybiB0b3RhbEhpdHMgPT09IGxlbmd0aCAqIHdpZHRoXHJcbiAgICB9XHJcbiAgICBjb25zdCBoaXQgPSAoKT0+e1xyXG4gICAgICAgIGlmKCFpc1N1bmsoKSl7XHJcbiAgICAgICAgICAgIHRvdGFsSGl0cysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG90YWxIaXRzO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZ2V0TGVuZ3RoID0gKCk9PntyZXR1cm4gbGVuZ3RofVxyXG4gICAgY29uc3QgZ2V0V2lkdGggPSAoKT0+eyByZXR1cm4gd2lkdGh9O1xyXG4gICAgY29uc3QgZ2V0SWQgPSAoKT0+e3JldHVybiBpZH07XHJcbiAgICBjb25zdCBnZXRTdGF0dXMgPSAoKT0+eyByZXR1cm4gc2hpcFN0YXR1c307XHJcbiAgICBjb25zdCBzZXRTdGF0dXMgPSAoc3RhdCkgPT57XHJcbiAgICAgICAgc2hpcFN0YXR1cyA9IHN0YXQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNldEhpdHMgPSAoKT0+e1xyXG4gICAgICAgIHRvdGFsSGl0cyA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge2dldExlbmd0aCwgZ2V0V2lkdGgsIGdldElkLCBnZXRTdGF0dXMsIHNldFN0YXR1cywgaGl0LCBpc1N1bmssIHJlc2V0SGl0c307XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEdhbWVib2FyZCgpe1xyXG4gICAgY29uc3QgSG9yaXpvbnRhbCA9IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgY29uc3QgVmVydGljYWwgPSBcInZlcnRpY2FsXCI7XHJcbiAgICBjb25zdCByYW5nZU1heCA9IDk7XHJcbiAgICBjb25zdCByYW5nZU1pbiA9IDA7XHJcbiAgICBjb25zdCBTdGF0dXMgPSB7XCJ1bmRlcGxveWVkXCI6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZXBsb3llZFwiOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3Vua1wiOiAtMVxyXG4gICAgfTtcclxuICAgIGNvbnN0IENlbGxzID0ge1wiZW1wdHlcIjogMCxcclxuICAgICAgICAgICAgICAgICAgIFwiaGl0XCI6ICcqJyxcclxuICAgICAgICAgICAgICAgICAgIFwibWlzc1wiOiAnLycsXHJcbiAgICAgICAgICAgICAgICAgICBcImNhXCI6IDEsXHJcbiAgICAgICAgICAgICAgICAgICBcImJhXCI6IDIsXHJcbiAgICAgICAgICAgICAgICAgICBcImNyXCI6IDMsXHJcbiAgICAgICAgICAgICAgICAgICBcInN1XCI6IDQsXHJcbiAgICAgICAgICAgICAgICAgICBcImRlXCI6IDVcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGNhcnJpZXIgPSBTaGlwKDUsMiwgQ2VsbHMuY2EsIFN0YXR1cy51bmRlcGxveWVkKTtcclxuICAgIGxldCBiYXR0bGVzaGlwID0gU2hpcCg0LDIsIENlbGxzLmJhLCBTdGF0dXMudW5kZXBsb3llZCk7XHJcbiAgICBsZXQgY3J1aXNlciA9IFNoaXAoMywxLCBDZWxscy5jciwgU3RhdHVzLnVuZGVwbG95ZWQpO1xyXG4gICAgbGV0IHN1Ym1hcmluZSA9IFNoaXAoMywxLCBDZWxscy5zdSwgU3RhdHVzLnVuZGVwbG95ZWQpO1xyXG4gICAgbGV0IGRlc3Ryb3llciA9IFNoaXAoMiwxLCBDZWxscy5kZSwgU3RhdHVzLnVuZGVwbG95ZWQpO1xyXG5cclxuICAgIGNvbnN0IEZsZWV0ID0ge1wiQ2FycmllclwiOntcInNoaXBcIjogY2FycmllciwgXCJjb29yZGluYXRlc1wiOiBbXSwgXCJkaXJlY3Rpb25cIjogXCJcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgXCJCYXR0bGVzaGlwXCI6e1wic2hpcFwiOiBiYXR0bGVzaGlwLCBcImNvb3JkaW5hdGVzXCI6IFtdLCBcImRpcmVjdGlvblwiOiBcIlwifSwgXHJcbiAgICAgICAgICAgICAgICAgICBcIkNydWlzZXJcIjp7XCJzaGlwXCI6IGNydWlzZXIsIFwiY29vcmRpbmF0ZXNcIjogW10sIFwiZGlyZWN0aW9uXCI6IFwiXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgIFwiU3VibWFyaW5lXCI6e1wic2hpcFwiOiBzdWJtYXJpbmUsIFwiY29vcmRpbmF0ZXNcIjogW10sIFwiZGlyZWN0aW9uXCI6IFwiXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgIFwiRGVzdHJveWVyXCI6e1wic2hpcFwiOiBkZXN0cm95ZXIsIFwiY29vcmRpbmF0ZXNcIjogW10sIFwiZGlyZWN0aW9uXCI6IFwiXCJ9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBnYW1lQm9hcmQgPSBbXTtcclxuXHJcbiAgICAvLyAwIGZvciBlbXB0eSBzcGFjZSwgMSBmb3Igc3BhY2Ugb2NjdXBpZWQgYnkgYSBzaGlwLlxyXG4gICAgY29uc3QgaW5pdEJvYXJkID0gKCk9PnsgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdhbWVCb2FyZFtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGdhbWVCb2FyZFtpXVtqXSA9IENlbGxzLmVtcHR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdEJvYXJkKCk7XHJcbiAgICBjb25zdCByZXNldEJvYXJkID0gKCk9PntcclxuICAgICAgICBpbml0Qm9hcmQoKTtcclxuICAgICAgICBmb3IobGV0IHNoaXBOYW1lIGluIEZsZWV0KXtcclxuICAgICAgICAgICAgRmxlZXRbc2hpcE5hbWVdLnNoaXAuc2V0U3RhdHVzKFN0YXR1cy51bmRlcGxveWVkKTtcclxuICAgICAgICAgICAgRmxlZXRbc2hpcE5hbWVdLnNoaXAucmVzZXRIaXRzKCk7XHJcbiAgICAgICAgICAgIEZsZWV0W3NoaXBOYW1lXS5jb29yZGluYXRlcyA9IFtdO1xyXG4gICAgICAgICAgICBGbGVldFtzaGlwTmFtZV0uZGlyZWN0aW9uID0gXCJcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cGRhdGVCb2FyZCA9ICh4LCB5LCBuZXdDZWxsKT0+e1xyXG4gICAgICAgIGdhbWVCb2FyZFt5XVt4XSA9IG5ld0NlbGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29vcmRCb3VuZHMgPSAobWlkQ29vcmQsIGRpcmVjdGlvbiwgc2hpcExlbmd0aCk9PntcclxuICAgICAgICBsZXQgc3RhcnRDb29yZDtcclxuICAgICAgICBsZXQgZW5kQ29vcmQ7XHJcbiAgICAgICAgY29uc3QgZGlzdFRvTWlkID0gTWF0aC5mbG9vcihzaGlwTGVuZ3RoLzIpO1xyXG4gICAgICAgIGxldCBldmVuTGVuZ3RoT2Zmc2V0ID0gMDtcclxuICAgICAgICBpZihzaGlwTGVuZ3RoICUgMiA9PSAwKXtcclxuICAgICAgICAgICAgZXZlbkxlbmd0aE9mZnNldCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRpcmVjdGlvbiA9PSBIb3Jpem9udGFsKXtcclxuICAgICAgICAgICAgc3RhcnRDb29yZCA9IFttaWRDb29yZFswXSAtIGRpc3RUb01pZCArIGV2ZW5MZW5ndGhPZmZzZXQsIG1pZENvb3JkWzFdXTtcclxuICAgICAgICAgICAgZW5kQ29vcmQgPSBbbWlkQ29vcmRbMF0gKyBkaXN0VG9NaWQsIG1pZENvb3JkWzFdXTtcclxuICAgICAgICB9ZWxzZSBpZihkaXJlY3Rpb24gPT0gVmVydGljYWwpe1xyXG4gICAgICAgICAgICBzdGFydENvb3JkID0gW21pZENvb3JkWzBdLCBtaWRDb29yZFsxXSAtIGRpc3RUb01pZCArIGV2ZW5MZW5ndGhPZmZzZXRdO1xyXG4gICAgICAgICAgICBlbmRDb29yZCA9IFttaWRDb29yZFswXSwgbWlkQ29vcmRbMV0gKyBkaXN0VG9NaWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3N0YXJ0Q29vcmQsIGVuZENvb3JkfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc1dpdGhpbkJvdW5kcyA9IChjb29yZCk9PntcclxuICAgICAgICBpZihjb29yZFswXSA8IHJhbmdlTWluIHx8IGNvb3JkWzBdID4gcmFuZ2VNYXggfHwgY29vcmRbMV0gPCByYW5nZU1pbiB8fCBjb29yZFsxXSA+IHJhbmdlTWF4KXtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpbnZhbGlkIGNvb3Jkcywgb3V0IG9mIGJvdW5kc1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGdldE91dE9mQm91bmRDb29yZHMgPSAoY29vcmRzKT0+e1xyXG4gICAgICAgIGxldCBpbnZhbGlkQ29vcmRpbmF0ZXMgPSBbXTtcclxuICAgICAgICBjb29yZHMuZm9yRWFjaChjb29yZCA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFpc1dpdGhpbkJvdW5kcyhjb29yZCkpe1xyXG4gICAgICAgICAgICAgICAgaW52YWxpZENvb3JkaW5hdGVzLnB1c2goY29vcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGludmFsaWRDb29yZGluYXRlcztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc1NwYWNlRW1wdHkgPSAoZGlyZWN0aW9uLCBzdGFydENvb3JkLCBsZW5ndGgpPT57XHJcbiAgICAgICAgbGV0IHggPSBzdGFydENvb3JkWzBdO1xyXG4gICAgICAgIGxldCB5ID0gc3RhcnRDb29yZFsxXTtcclxuICAgICAgICBjb25zdCBJZHMgPSBbQ2VsbHMuY2EsIENlbGxzLmJhLCBDZWxscy5jciwgQ2VsbHMuc3UsIENlbGxzLmRlXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxsZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKElkcy5pbmNsdWRlcyhnYW1lQm9hcmRbeV1beF0pKXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW52YWxpZCBjb29yZHMsIGNvbGxpc2lvbiBkZXRlY3RlZFwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbCA/IHgrKyA6IHkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNQbGFjZW1lbnRWYWxpZCA9IChtaWRDb29yZCwgZGlyZWN0aW9uLCBzaGlwTmFtZSk9PntcclxuICAgICAgICBpZighaXNTaGlwVmFsaWQoc2hpcE5hbWUpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc2hpcExlbmd0aCA9IEZsZWV0W3NoaXBOYW1lXS5zaGlwLmdldExlbmd0aCgpO1xyXG4gICAgICAgIGxldCBzaGlwV2lkdGggPSBGbGVldFtzaGlwTmFtZV0uc2hpcC5nZXRXaWR0aCgpO1xyXG4gICAgICAgIGxldCBtaWRYID0gbWlkQ29vcmRbMF07XHJcbiAgICAgICAgbGV0IG1pZFkgPSBtaWRDb29yZFsxXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxzaGlwV2lkdGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHtzdGFydENvb3JkLCBlbmRDb29yZH0gPSBjb29yZEJvdW5kcyhbbWlkWCxtaWRZXSwgZGlyZWN0aW9uLCBzaGlwTGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYoIShpc1dpdGhpbkJvdW5kcyhzdGFydENvb3JkKSAmJiBpc1dpdGhpbkJvdW5kcyhlbmRDb29yZCkgJiYgaXNTcGFjZUVtcHR5KGRpcmVjdGlvbiwgc3RhcnRDb29yZCwgc2hpcExlbmd0aCkpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPT09IEhvcml6b250YWwgPyBtaWRZKysgOiBtaWRYKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlzU2hpcFZhbGlkID0oc2hpcE5hbWUpPT57XHJcbiAgICAgICAgbGV0IHNoaXBPYmogPSBGbGVldFtzaGlwTmFtZV07XHJcbiAgICAgICAgaWYoIXNoaXBPYmope1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVycm9yLCBpbmNvcnJlY3Qgc2hpcCBuYW1lXCIpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2hpcE9iai5zaGlwLmdldFN0YXR1cygpICE9IFN0YXR1cy51bmRlcGxveWVkKXtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjYW4gbm90IHBsYWNlIGFuIGFscmVhZHkgZGVwbG95ZWQgb3Igc3VuayBzaGlwXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdldFBsYWNlbWVudCA9IChtaWRDb29yZCwgZGlyZWN0aW9uLCBzaGlwTmFtZSk9PntcclxuICAgICAgICBsZXQgc2hpcCA9IEZsZWV0W3NoaXBOYW1lXS5zaGlwO1xyXG4gICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSBbXTtcclxuICAgICAgICBsZXQgc2hpcHdpZHRoID0gc2hpcC5nZXRXaWR0aCgpO1xyXG4gICAgICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcC5nZXRMZW5ndGgoKTtcclxuICAgICAgICBsZXQgbWlkWCA9IG1pZENvb3JkWzBdO1xyXG4gICAgICAgIGxldCBtaWRZID0gbWlkQ29vcmRbMV07XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8c2hpcHdpZHRoOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zdCB7c3RhcnRDb29yZCwgZW5kQ29vcmR9ID0gY29vcmRCb3VuZHMoW21pZFgsIG1pZFldLCBkaXJlY3Rpb24sIHNoaXBMZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgeCA9IHN0YXJ0Q29vcmRbMF07XHJcbiAgICAgICAgICAgIGxldCB5ID0gc3RhcnRDb29yZFsxXTtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8c2hpcExlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgIHNoaXBDb29yZGluYXRlcy5wdXNoKFt4LHldKTtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbCA/IHgrKyA6IHkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPT09IEhvcml6b250YWwgPyBtaWRZKysgOiBtaWRYKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzaGlwQ29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGxhY2VTaGlwID0gKG1pZENvb3JkLCBkaXJlY3Rpb24sIHNoaXBOYW1lKT0+e1xyXG4gICAgICAgIGxldCBzaGlwT2JqID0gRmxlZXRbc2hpcE5hbWVdO1xyXG4gICAgICAgIGlmKCFpc1BsYWNlbWVudFZhbGlkKG1pZENvb3JkLCBkaXJlY3Rpb24sIHNoaXBOYW1lKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNoaXBDb29yZGluYXRlcyA9IGdldFBsYWNlbWVudChtaWRDb29yZCwgZGlyZWN0aW9uLCBzaGlwTmFtZSk7XHJcbiAgICAgICAgc2hpcE9iai5jb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlcztcclxuICAgICAgICBzaGlwT2JqLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuICAgICAgICBzaGlwQ29vcmRpbmF0ZXMuZm9yRWFjaChjb29yZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBjb29yZFswXTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGNvb3JkWzFdO1xyXG4gICAgICAgICAgICB1cGRhdGVCb2FyZCh4LCB5LCBzaGlwT2JqLnNoaXAuZ2V0SWQoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2hpcE9iai5zaGlwLnNldFN0YXR1cyhTdGF0dXMuZGVwbG95ZWQpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYXJlU2hpcHNPbkJvYXJkID0gKCk9PntcclxuICAgICAgICBsZXQgY2hlY2sgPSB0cnVlO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKEZsZWV0KS5mb3JFYWNoKHNoaXBOYW1lID0+IHtcclxuICAgICAgICAgICAgaWYoRmxlZXRbc2hpcE5hbWVdLnNoaXAuZ2V0U3RhdHVzKCkgPT09IFN0YXR1cy51bmRlcGxveWVkKXtcclxuICAgICAgICAgICAgICAgIGNoZWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBpZighY2hlY2spe2NvbnNvbGUubG9nKFwiYWxsIHNoaXBzIGFyZSBub3QgZGVwbG95ZWQgeWV0XCIpfVxyXG4gICAgICAgIHJldHVybiBjaGVjaztcclxuICAgIH1cclxuICAgIGNvbnN0IHNoaXBzU3VuayA9ICgpPT57XHJcbiAgICAgICAgaWYoIWFyZVNoaXBzT25Cb2FyZCgpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2hlY2sgPSB0cnVlO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKEZsZWV0KS5mb3JFYWNoKHNoaXBOYW1lID0+IHtcclxuICAgICAgICAgICAgaWYoRmxlZXRbc2hpcE5hbWVdLnNoaXAuZ2V0U3RhdHVzKCkgIT09IFN0YXR1cy5zdW5rKXtcclxuICAgICAgICAgICAgICAgIGNoZWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY2hlY2s7XHJcblxyXG4gICAgfVxyXG4gICAgY29uc3QgZ2V0U3Vua2VuID0gKCk9PntcclxuICAgICAgICBsZXQgc3Vua2VuU2hpcHMgPSBbXTtcclxuICAgICAgICBpZighYXJlU2hpcHNPbkJvYXJkKCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gc3Vua2VuU2hpcHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5rZXlzKEZsZWV0KS5mb3JFYWNoKHNoaXBOYW1lID0+IHtcclxuICAgICAgICAgICAgaWYoRmxlZXRbc2hpcE5hbWVdLnNoaXAuZ2V0U3RhdHVzKCkgPT0gU3RhdHVzLnN1bmspe1xyXG4gICAgICAgICAgICAgICAgc3Vua2VuU2hpcHMucHVzaChzaGlwTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc3Vua2VuU2hpcHM7XHJcblxyXG4gICAgfVxyXG4gICAgY29uc3QgaXNBdHRhY2tWYWxpZCA9IChjb29yZCk9PntcclxuICAgICAgICBsZXQgeCA9IGNvb3JkWzBdO1xyXG4gICAgICAgIGxldCB5ID0gY29vcmRbMV07XHJcbiAgICAgICAgY29uc3QgdmFsaWRDZWxscyA9IFtDZWxscy5lbXB0eSwgQ2VsbHMuY2EsIENlbGxzLmJhLCBDZWxscy5jciwgQ2VsbHMuc3UsIENlbGxzLmRlXTtcclxuICAgICAgICAvLyBpbnZhbGlkIGNlbGxzIHdvdWxkIGJlIFtDZWxscy5oaXQsIENlbGxzLm1pc3NdXHJcbiAgICAgICAgLy8gaWYgY29vcmQgaXMgZm91bmQgaW4gdmFsaWRDZWxscywgYXR0YWNrIGlzIG5vdCByZXBlYXRlZCBhbmQgdmFsaWQsIFxyXG4gICAgICAgIC8vIGVsc2UgY2VsbCBhdCB0aGlzIGNvb3JkIHdvdWxkIGVpdGhlciBoYXZlIGJlZW4gYSBoaXQgb3IgYSBtaXNzIChpbnZhbGlkKS5cclxuICAgICAgICBpZih2YWxpZENlbGxzLmluY2x1ZGVzKGdhbWVCb2FyZFt5XVt4XSkpe1xyXG4gICAgICAgICAgICAvL2luIG9yZGVyIGZvciBhdHRhY2sgdG8gcHJvY2VlZCBhbGwgc2hpcHMgbXVzdCBiZSBkZXBsb3llZCBhbmQgY29vcmRzIHdpdGhpbiBib3VuZHMuXHJcbiAgICAgICAgICAgIHJldHVybiAoaXNXaXRoaW5Cb3VuZHMoY29vcmQpICYmIGFyZVNoaXBzT25Cb2FyZCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBnZXRTaGlwT2JqQnlJZCA9IChpZCk9PntcclxuICAgICAgICBsZXQgc2hpcE9iaiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBPYmplY3Qua2V5cyhGbGVldCkuZm9yRWFjaChzaGlwTmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKEZsZWV0W3NoaXBOYW1lXS5zaGlwLmdldElkKCkgPT0gaWQpe1xyXG4gICAgICAgICAgICAgICAgc2hpcE9iaiA9IEZsZWV0W3NoaXBOYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaGlwT2JqO1xyXG4gICAgfVxyXG4gICAgLy9hdHRhY2sgY2FuIG9ubHkgcHJvY2VlZCBpZiBhbGwgc2hpcHMgYXJlIGRlcGxveWVkLCBjb29yZHMgYXJlIHdpdGhpbiBib3VuZHMgYW5kIG5vdCB1c2VkIHByZXZpb3VzbHkgZm9yIGFub3RoZXIgYXR0YWNrLlxyXG4gICAgLy9hdHRhY2sgaXMgYSBoaXQgaWYgc2hpcCBleGlzdHMgb24gY29vcmRzLCBlbHNlLCBpdCdzIGEgbWlzcy5cclxuICAgIC8vaWYgaGl0LCB1cGRhdGUgaGl0cyBvbiB0aGUgY29ycmVzcG9uZGluZyBzaGlwXHJcbiAgICAvL3VwZGF0ZSBib2FyZCBvbiBib3RoIGhpdCBhbmQgbWlzc1xyXG4gICAgLy9yZXR1cm4gdHJ1ZSBpZiBoaXQsIGZhbHNlIGlmIG1pc3MsIHVuZGVmaW5lZCBvdGhlcndpc2UuXHJcbiAgICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3JkKT0+e1xyXG4gICAgICAgIGlmKCFpc0F0dGFja1ZhbGlkKGNvb3JkKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB4ID0gY29vcmRbMF07XHJcbiAgICAgICAgbGV0IHkgPSBjb29yZFsxXTtcclxuICAgICAgICBjb25zdCBpZHMgPSBbQ2VsbHMuY2EsIENlbGxzLmJhLCBDZWxscy5jciwgQ2VsbHMuc3UsIENlbGxzLmRlXTtcclxuXHJcbiAgICAgICAgLy9pZiBoaXRcclxuICAgICAgICBpZihpZHMuaW5jbHVkZXMoZ2FtZUJvYXJkW3ldW3hdKSl7XHJcbiAgICAgICAgICAgIGxldCBzaGlwID0gZ2V0U2hpcE9iakJ5SWQoZ2FtZUJvYXJkW3ldW3hdKS5zaGlwO1xyXG4gICAgICAgICAgICBzaGlwLmhpdCgpO1xyXG4gICAgICAgICAgICB1cGRhdGVCb2FyZCh4LHksQ2VsbHMuaGl0KTtcclxuICAgICAgICAgICAgaWYoc2hpcC5pc1N1bmsoKSl7XHJcbiAgICAgICAgICAgICAgICBzaGlwLnNldFN0YXR1cyhTdGF0dXMuc3Vuayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL21pc3Mgb3RoZXJ3aXNlXHJcbiAgICAgICAgdXBkYXRlQm9hcmQoeCx5LENlbGxzLm1pc3MpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGdldEZsZWV0ID0gKCk9PntcclxuICAgICAgICByZXR1cm4gRmxlZXQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsb2dCb2FyZCA9ICgpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdhbWVCb2FyZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ2FtZUJvYXJkW2ldLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICByb3cgKz0gZ2FtZUJvYXJkW2ldW2pdICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cocm93KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBzaW5rU2hpcHMgPSAoKT0+e1xyXG4gICAgICAgIGxldCBjaGVjayA9IHRydWU7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoRmxlZXQpLmZvckVhY2goc2hpcE5hbWUgPT4ge1xyXG4gICAgICAgICAgICBGbGVldFtzaGlwTmFtZV0uc2hpcC5zZXRTdGF0dXMoU3RhdHVzLnN1bmspO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7Z2V0UGxhY2VtZW50LFxyXG4gICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkLCBcclxuICAgICAgICAgICAgcGxhY2VTaGlwLCBcclxuICAgICAgICAgICAgcmVjZWl2ZUF0dGFjayxcclxuICAgICAgICAgICAgZ2V0T3V0T2ZCb3VuZENvb3JkcyxcclxuICAgICAgICAgICAgYXJlU2hpcHNPbkJvYXJkLFxyXG4gICAgICAgICAgICBnZXRGbGVldCxcclxuICAgICAgICAgICAgZ2V0U3Vua2VuLFxyXG4gICAgICAgICAgICBzaGlwc1N1bmssXHJcbiAgICAgICAgICAgIHNpbmtTaGlwcyxcclxuICAgICAgICAgICAgcmVzZXRCb2FyZCxcclxuICAgICAgICAgICAgbG9nQm9hcmR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBQbGF5ZXIoKXtcclxuICAgIGxldCBib2FyZCA9IEdhbWVib2FyZCgpO1xyXG4gICAgY29uc3QgcGxhY2VTaGlwID0gKGNvb3JkcywgZGlyZWN0aW9uLCBzaGlwTmFtZSk9PntcclxuICAgICAgICByZXR1cm4gYm9hcmQucGxhY2VTaGlwKGNvb3JkcywgZGlyZWN0aW9uLCBzaGlwTmFtZSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBnZXRQbGFjZW1lbnRDb29yZHMgPSAoY29vcmRzLCBkaXJlY3Rpb24sIHNoaXBOYW1lKT0+e1xyXG4gICAgICAgIGxldCBwbGFjZW1lbnRDb29yZHMgPSBib2FyZC5nZXRQbGFjZW1lbnQoY29vcmRzLCBkaXJlY3Rpb24sIHNoaXBOYW1lKTtcclxuICAgICAgICBsZXQgb3V0T2ZCb3VuZENvb3JkcyA9IGJvYXJkLmdldE91dE9mQm91bmRDb29yZHMocGxhY2VtZW50Q29vcmRzKTtcclxuICAgICAgICBsZXQgdW5pcXVlQ29vcmRzID0gcGxhY2VtZW50Q29vcmRzLmZpbHRlcihjb29yZCA9PiAhb3V0T2ZCb3VuZENvb3Jkcy5pbmNsdWRlcyhjb29yZCkpOyAvL2ludGVyc2VjdGlvbiBvZiB0aGUgdHdvIGNvb3JkaW5hdGUgYXJyYXlzLlxyXG4gICAgICAgIHJldHVybiB1bmlxdWVDb29yZHM7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjaGVja1BsYWNlbWVudCA9IChjb29yZHMsIGRpcmVjdGlvbiwgc2hpcE5hbWUpPT57XHJcbiAgICAgICAgcmV0dXJuIGJvYXJkLmlzUGxhY2VtZW50VmFsaWQoY29vcmRzLCBkaXJlY3Rpb24sIHNoaXBOYW1lKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcmRzKT0+e1xyXG4gICAgICAgIHJldHVybiBib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3Jkcyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNldEJvYXJkID0gKCk9PntcclxuICAgICAgICBib2FyZC5yZXNldEJvYXJkKCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBhcmVTaGlwc09uQm9hcmQgPSAoKT0+e1xyXG4gICAgICAgIHJldHVybiBib2FyZC5hcmVTaGlwc09uQm9hcmQoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGdldEZsZWV0ID0gKCk9PntcclxuICAgICAgICByZXR1cm4gYm9hcmQuZ2V0RmxlZXQoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGdldFN1bmtlbiA9ICgpPT57XHJcbiAgICAgICAgcmV0dXJuIGJvYXJkLmdldFN1bmtlbigpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYXJlU2hpcHNTdW5rID0gKCk9PntcclxuICAgICAgICByZXR1cm4gYm9hcmQuc2hpcHNTdW5rKCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzaW5rU2hpcHMgPSAoKT0+e1xyXG4gICAgICAgIHJldHVybiBib2FyZC5zaW5rU2hpcHMoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGxvZ0JvYXJkID0gKCk9PntcclxuICAgICAgICByZXR1cm4gYm9hcmQubG9nQm9hcmQoKTtcclxuICAgIH1cclxuICAgIHJldHVybntwbGFjZVNoaXAsIFxyXG4gICAgICAgIGdldFBsYWNlbWVudENvb3JkcywgXHJcbiAgICAgICAgY2hlY2tQbGFjZW1lbnQsIFxyXG4gICAgICAgIGFyZVNoaXBzT25Cb2FyZCwgXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayxcclxuICAgICAgICBnZXRGbGVldCxcclxuICAgICAgICBnZXRTdW5rZW4sXHJcbiAgICAgICAgcmVzZXRCb2FyZCxcclxuICAgICAgICBhcmVTaGlwc1N1bmssXHJcbiAgICAgICAgc2lua1NoaXBzLFxyXG4gICAgICAgIGxvZ0JvYXJkLFxyXG4gICAgfTtcclxufSBcclxuXHJcbmZ1bmN0aW9uIENvbXB1dGVyKCl7XHJcbiAgICBsZXQgY3B1ID0gUGxheWVyKCk7XHJcbiAgICBsZXQgYXZhaWxhYmxlQ29vcmRzO1xyXG4gICAgbGV0IGhpdHM7XHJcbiAgICBjb25zdCB2YWxpZFJhbmdlID0gWzAsMSwyLDMsNCw1LDYsNyw4LDldO1xyXG4gICAgY29uc3QgSG9yaXpvbnRhbCA9IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgY29uc3QgVmVydGljYWwgPSBcInZlcnRpY2FsXCI7XHJcbiAgICBsZXQgc2hpcE5hbWVzID0gW107XHJcbiAgICBsZXQgYWxsRW5lbXlTdW5rID0gW107XHJcblxyXG4gICAgY29uc3QgaW5pdCA9ICgpPT57XHJcbiAgICAgICAgYXZhaWxhYmxlQ29vcmRzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlQ29vcmRzLnB1c2goW2ksal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhpdHMgPSBbXTtcclxuICAgICAgICBhbGxFbmVteVN1bmsgPSBbXTtcclxuICAgICAgICBzaGlwTmFtZXMgPSBbXCJDYXJyaWVyXCIsIFwiQmF0dGxlc2hpcFwiLCBcIkNydWlzZXJcIiwgXCJTdWJtYXJpbmVcIiwgXCJEZXN0cm95ZXJcIl07XHJcbiAgICB9XHJcbiAgICBpbml0KCk7XHJcblxyXG4gICAgY29uc3QgcGlja1JhbmRvbUZyb21BcnJheSA9IChhcnJheSk9PntcclxuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCk7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBsYWNlU2hpcCA9ICgpPT57XHJcbiAgICAgICAgbGV0IGNoZWNrID0gdHJ1ZTtcclxuICAgICAgICB3aGlsZShjaGVjayl7XHJcbiAgICAgICAgICAgIGxldCB4ID0gcGlja1JhbmRvbUZyb21BcnJheSh2YWxpZFJhbmdlKTtcclxuICAgICAgICAgICAgbGV0IHkgPSBwaWNrUmFuZG9tRnJvbUFycmF5KHZhbGlkUmFuZ2UpO1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gcGlja1JhbmRvbUZyb21BcnJheShbSG9yaXpvbnRhbCwgVmVydGljYWxdKTtcclxuICAgICAgICAgICAgbGV0IHNoaXBOYW1lID0gcGlja1JhbmRvbUZyb21BcnJheShzaGlwTmFtZXMpO1xyXG4gICAgICAgICAgICBpZihjcHUuY2hlY2tQbGFjZW1lbnQoW3gseV0sIGRpcmVjdGlvbiwgc2hpcE5hbWUpKXtcclxuICAgICAgICAgICAgICAgIGNwdS5wbGFjZVNoaXAoW3gseV0sIGRpcmVjdGlvbiwgc2hpcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgc2hpcE5hbWVzID0gc2hpcE5hbWVzLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IHNoaXBOYW1lKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBwbGFjZVNoaXBzID0gKCk9PntcclxuICAgICAgICB3aGlsZShjcHUuYXJlU2hpcHNPbkJvYXJkKCkgIT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHBsYWNlU2hpcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGdldEZsZWV0ID0gKCk9PntcclxuICAgICAgICByZXR1cm4gY3B1LmdldEZsZWV0KCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3Jkcyk9PntcclxuICAgICAgICByZXR1cm4gY3B1LnJlY2VpdmVBdHRhY2soY29vcmRzKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGdldFN1bmtlbiA9ICgpPT57XHJcbiAgICAgICAgcmV0dXJuIGNwdS5nZXRTdW5rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvL2dldCBuZXh0IG1vdmUgY29zbmlkZXJpbmcgbGFzdCBtb3ZlXHJcbiAgICBjb25zdCBnZXROZXh0TW92ZSA9IChoaXRzKT0+e1xyXG4gICAgICAgIHdoaWxlKHRydWUpe1xyXG4gICAgICAgICAgICBsZXQgdmFsaWRIaXQgPSBoaXRzLmZpbmQoaGl0ID0+ICFoaXQuaXNFeGhhdXN0ZWQpO1xyXG4gICAgICAgICAgICBpZiAoIXZhbGlkSGl0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQWxsIGhpdHMgZXhoYXVzdGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBsYXN0SGl0ID0gdmFsaWRIaXQuaGl0Q29vcmRzO1xyXG4gICAgICAgICAgICBsZXQgbGFzdERpcmVjdGlvbiA9IHZhbGlkSGl0LmhpdERpcmVjdGlvbjtcclxuICAgICAgICAgICAgbGV0IG5leHRNb3ZlcyA9IHtcInJpZ2h0XCI6W2xhc3RIaXRbMF0rMSxsYXN0SGl0WzFdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidXBcIjpbbGFzdEhpdFswXSxsYXN0SGl0WzFdLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsZWZ0XCI6W2xhc3RIaXRbMF0tMSxsYXN0SGl0WzFdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZG93blwiOltsYXN0SGl0WzBdLGxhc3RIaXRbMV0rMV0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcHJpb3JpdGl6ZSBtb3ZpbmcgaW4gdGhlIGRpcmVjdGlvbiBvZiB0aGUgbGFzdCBzdWNjZXNzZnVsIG1vdmVcclxuICAgICAgICAgICAgLy8gbGFzdERpcmVjdGlvbiBlc3NlbnRpYWxseSBhY3RzIGFzIGEgc2luZ2xlIG1vdmUgaGlzdG9yeVxyXG4gICAgICAgICAgICBpZihhdmFpbGFibGVDb29yZHMuc29tZShjb29yZCA9PiBKU09OLnN0cmluZ2lmeShjb29yZCkgPT09IEpTT04uc3RyaW5naWZ5KG5leHRNb3Zlc1tsYXN0RGlyZWN0aW9uXSkpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbbmV4dE1vdmVzW2xhc3REaXJlY3Rpb25dLCBsYXN0RGlyZWN0aW9uXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBtb3ZlRGlyZWN0aW9uIGluIG5leHRNb3Zlcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYXZhaWxhYmxlQ29vcmRzLmZpbmQoY29vcmQgPT4gSlNPTi5zdHJpbmdpZnkoY29vcmQpID09PSBKU09OLnN0cmluZ2lmeShuZXh0TW92ZXNbbW92ZURpcmVjdGlvbl0pKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbbmV4dE1vdmVzW21vdmVEaXJlY3Rpb25dLCBtb3ZlRGlyZWN0aW9uXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsaWRIaXQuaXNFeGhhdXN0ZWQgPSB0cnVlIC8vYWxsIHBvc3NpYmxlIHBhdGhzIGZyb20gbGFzdCB2YWxpZCBoaXQgbGVhZCB0byBtaXNzZWQgc2hvdHNcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZU1vdmUgPSAocGxheWVyT2JqKT0+e1xyXG4gICAgICAgIGxldCBuZXdNb3ZlO1xyXG4gICAgICAgIGxldCBpbmRleDtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gXCJyaWdodFwiOyAvL2RlZmF1bHQgZGlyZWN0aW9uIG9mIGEgbmV3IG1vdmVcclxuICAgICAgICAvL2lmIG5vIHNoaXAgaGFzIGJlZW4gc3RydWNrIHlldCwgcGljayBhIHJhbmRvbSBjb29yZC5cclxuICAgICAgICBpZihoaXRzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhdmFpbGFibGVDb29yZHMubGVuZ3RoKTtcclxuICAgICAgICAgICAgbmV3TW92ZSA9IGF2YWlsYWJsZUNvb3Jkc1tpbmRleF07XHJcbiAgICAgICAgICAgIGF2YWlsYWJsZUNvb3Jkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNleyAvLyBpZiBzaGlwIGhhcyBiZWVuIGhpdCBwcmV2aW91c2x5LCBmaW5kIHRoZSBuZXh0IHBvc3NpYmxlIG1vdmUgZnJvbSBsYXN0SGl0LlxyXG4gICAgICAgICAgICBsYXN0SGl0ID0gaGl0c1swXS5oaXRDb29yZHM7XHJcbiAgICAgICAgICAgIGxhc3REaXJlY3Rpb24gPSBoaXRzWzBdLmhpdERpcmVjdGlvbjtcclxuICAgICAgICAgICAgW25ld01vdmUsIGRpcmVjdGlvbl0gPSBnZXROZXh0TW92ZShoaXRzKTtcclxuICAgICAgICAgICAgaW5kZXggPSBhdmFpbGFibGVDb29yZHMuZmluZEluZGV4KGNvb3JkID0+IGNvb3JkWzBdID09PSBuZXdNb3ZlWzBdICYmIGNvb3JkWzFdID09PSBuZXdNb3ZlWzFdKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlQ29vcmRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhdHRhY2tTdGF0dXMgPSBwbGF5ZXJPYmoucmVjZWl2ZUF0dGFjayhbbmV3TW92ZVswXSwgbmV3TW92ZVsxXV0pO1xyXG4gICAgICAgIGlmKGF0dGFja1N0YXR1cyl7IC8vaWYgYXR0YWNrIGhpdCBhIHNoaXBcclxuICAgICAgICAgICAgbGV0IGhpdE9iaiA9IHtcImhpdENvb3Jkc1wiOiBbbmV3TW92ZVswXSwgbmV3TW92ZVsxXV0sIFwiaGl0RGlyZWN0aW9uXCI6ZGlyZWN0aW9uLCBcImlzRXhoYXVzdGVkXCI6ZmFsc2V9O1xyXG4gICAgICAgICAgICBoaXRzLnVuc2hpZnQoaGl0T2JqKTtcclxuICAgICAgICAgICAgbGV0IHVwZGF0ZWRTdW5rZW4gPSBwbGF5ZXJPYmouZ2V0U3Vua2VuKCk7XHJcbiAgICAgICAgICAgIGxldCBzdW5rZW5TaGlwTmFtZSA9IHVwZGF0ZWRTdW5rZW4uZmluZChpdGVtID0+ICFhbGxFbmVteVN1bmsuaW5jbHVkZXMoaXRlbSkpO1xyXG4gICAgICAgICAgICBpZihzdW5rZW5TaGlwTmFtZSl7IC8vIGlmIGhpdCBjYXVzZWQgYSBzaGlwIHRvIHNpbmsuXHJcbiAgICAgICAgICAgICAgICBhbGxFbmVteVN1bmsgPSB1cGRhdGVkU3Vua2VuO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmxlZXQgPSBwbGF5ZXJPYmouZ2V0RmxlZXQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBPYmogPSBmbGVldFtzdW5rZW5TaGlwTmFtZV07XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlTnVtYmVyT2ZNb3ZlcyA9IHNoaXBPYmouY29vcmRpbmF0ZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaGl0cy5zcGxpY2UoMCwgcmVtb3ZlTnVtYmVyT2ZNb3Zlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtuZXdNb3ZlLCBhdHRhY2tTdGF0dXNdO1xyXG5cclxuICAgIH1cclxuICAgIGNvbnN0IGFkZFRvSGl0ID0gKGNvb3JkcywgcGxheWVyT2JqKT0+e1xyXG4gICAgICAgIHBsYXllck9iai5yZWNlaXZlQXR0YWNrKFtjb29yZHNbMF0sIGNvb3Jkc1sxXV0pO1xyXG4gICAgICAgIGxldCBoaXRPYmogPSB7XCJoaXRDb29yZHNcIjogW2Nvb3Jkc1swXSwgY29vcmRzWzFdXSwgXCJoaXREaXJlY3Rpb25cIjpcInJpZ2h0XCIsIFwiaXNFeGhhdXN0ZWRcIjpmYWxzZX07XHJcbiAgICAgICAgaGl0cy51bnNoaWZ0KGhpdE9iaik7XHJcbiAgICAgICAgaW5kZXggPSBhdmFpbGFibGVDb29yZHMuZmluZEluZGV4KGNvb3JkID0+IGNvb3JkWzBdID09PSBjb29yZHNbMF0gJiYgY29vcmRbMV0gPT09IGNvb3Jkc1sxXSk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBhdmFpbGFibGVDb29yZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBzaW5rU2hpcHMgPSAoKT0+e1xyXG4gICAgICAgIHJldHVybiBjcHUuc2lua1NoaXBzKCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBhcmVTaGlwc1N1bmsgPSAoKT0+e1xyXG4gICAgICAgIHJldHVybiBjcHUuYXJlU2hpcHNTdW5rKCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNldEJvYXJkID0gKCk9PntcclxuICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgcmV0dXJuIGNwdS5yZXNldEJvYXJkKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm57cGxhY2VTaGlwcywgcmVjZWl2ZUF0dGFjaywgZ2V0RmxlZXQsIGdldFN1bmtlbiwgbWFrZU1vdmUsIGFkZFRvSGl0LCBhcmVTaGlwc1N1bmssIHNpbmtTaGlwcyxyZXNldEJvYXJkLH07XHJcbn1cclxuXHJcbi8vIGxldCBwbGF5ZXIxID0gUGxheWVyKCk7XHJcbi8vIHBsYXllcjEucGxhY2VTaGlwKFsyLDNdLCBcInZlcnRpY2FsXCIsIFwiQ2FycmllclwiKVxyXG4vLyBwbGF5ZXIxLnBsYWNlU2hpcChbNSw4XSwgXCJob3Jpem9udGFsXCIsIFwiQmF0dGxlc2hpcFwiKVxyXG4vLyBwbGF5ZXIxLnBsYWNlU2hpcChbMSw3XSwgXCJ2ZXJ0aWNhbFwiLCBcIlN1Ym1hcmluZVwiKVxyXG4vLyBwbGF5ZXIxLnBsYWNlU2hpcChbNCwwXSwgXCJob3Jpem9udGFsXCIsIFwiQ3J1aXNlclwiKVxyXG4vLyBwbGF5ZXIxLnBsYWNlU2hpcChbNSw1XSwgXCJob3Jpem9udGFsXCIsIFwiRGVzdHJveWVyXCIpXHJcbi8vIHBsYXllcjEuYm9hcmQubG9nQm9hcmQoKTtcclxuLy8gbGV0IGNwdSA9IENvbXB1dGVyKCk7XHJcbi8vIGNwdS5wbGFjZVNoaXBzKCk7XHJcbi8vIGNwdS5hZGRUb0hpdChbMywxXSwgcGxheWVyMSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtTaGlwLCBHYW1lYm9hcmQsIFBsYXllciwgQ29tcHV0ZXJ9OyIsIlxyXG5pbXBvcnQgdm9sdW1lT24gZnJvbSAnLi9hc3NldHMvbWVudS92b2x1bWUtaGlnaC5zdmcnO1xyXG5pbXBvcnQgdm9sdW1lT2ZmIGZyb20gJy4vYXNzZXRzL21lbnUvdm9sdW1lLW9mZi5zdmcnO1xyXG5pbXBvcnQgcGlyYXRlSW1nIGZyb20gJy4vYXNzZXRzL2NoYXJhY3RlcnMvcGlkbGUyLmdpZidcclxuaW1wb3J0IHZpa2luZ0ltZyBmcm9tICcuL2Fzc2V0cy9jaGFyYWN0ZXJzL3Zpa2luZ0lkbGUuZ2lmJ1xyXG5cclxuaW1wb3J0IG1lbnVNdXNpYyBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvR2FtZU11c2ljL01lbnUud2F2J1xyXG5pbXBvcnQgbGV2bGVNdXNpYyBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvR2FtZU11c2ljL0xldmVsLndhdidcclxuaW1wb3J0IGNvbWJhdE11c2ljIGZyb20gJy4vYXNzZXRzL3NvdW5kcy9HYW1lTXVzaWMvQ29tYmF0LndhdidcclxuaW1wb3J0IGhpdFNvdW5kIGZyb20gJy4vYXNzZXRzL3NvdW5kcy9HYW1lTXVzaWMvaGl0LndhdidcclxuaW1wb3J0IG1pc3NTb3VuZCBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvR2FtZU11c2ljL21pc3Mud2F2J1xyXG5pbXBvcnQgdmljdG9yeVNvdW5kIGZyb20gJy4vYXNzZXRzL3NvdW5kcy9HYW1lTXVzaWMvdmljdG9yeS53YXYnXHJcbmltcG9ydCBsb3NlU291bmQgZnJvbSAnLi9hc3NldHMvc291bmRzL0dhbWVNdXNpYy9sb3NlLndhdidcclxuXHJcbmltcG9ydCB2aWtpbmcxIGZyb20gJy4vYXNzZXRzL3NvdW5kcy9WaWtpbmdEaWFsb2d1ZS9zaGVpbGRUb3NoZWlsZC53YXYnXHJcbmltcG9ydCB2aWtpbmcyIGZyb20gJy4vYXNzZXRzL3NvdW5kcy9WaWtpbmdEaWFsb2d1ZS90aG9ySnVkZ2Uud2F2J1xyXG5pbXBvcnQgdmlraW5nMyBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvVmlraW5nRGlhbG9ndWUvdmFsaGFsbGFBZG1pdHMud2F2J1xyXG5pbXBvcnQgdmlraW5nNCBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvVmlraW5nRGlhbG9ndWUvbGVhdmVNZS53YXYnXHJcbmltcG9ydCB2aWtpbmc1IGZyb20gJy4vYXNzZXRzL3NvdW5kcy9WaWtpbmdEaWFsb2d1ZS90b0FybXMud2F2J1xyXG5pbXBvcnQgdmlraW5nNiBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvVmlraW5nRGlhbG9ndWUvbm90UG9zc2libGUud2F2J1xyXG5pbXBvcnQgdmlraW5nNyBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvVmlraW5nRGlhbG9ndWUvZ29sZENhbkJ1eS53YXYnXHJcblxyXG5pbXBvcnQgcGlyYXRlMSBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvUGlyYXRlRGlhbG9ndWUvYWxsSGFuZHMxLndhdidcclxuaW1wb3J0IHBpcmF0ZTIgZnJvbSAnLi9hc3NldHMvc291bmRzL1BpcmF0ZURpYWxvZ3VlL2ZpcmVJblRoZUhvbGUud2F2J1xyXG5pbXBvcnQgcGlyYXRlMyBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvUGlyYXRlRGlhbG9ndWUvd2Fsa1RoZVBsYW5rLndhdidcclxuaW1wb3J0IHBpcmF0ZTQgZnJvbSAnLi9hc3NldHMvc291bmRzL1BpcmF0ZURpYWxvZ3VlL2JhdHRlbkhhdGNoZXMud2F2J1xyXG5pbXBvcnQgcGlyYXRlNSBmcm9tICcuL2Fzc2V0cy9zb3VuZHMvUGlyYXRlRGlhbG9ndWUvaG9pc3RKZWxseS53YXYnXHJcbmltcG9ydCBwaXJhdGU2IGZyb20gJy4vYXNzZXRzL3NvdW5kcy9QaXJhdGVEaWFsb2d1ZS9hYmFuZG9uLndhdidcclxuaW1wb3J0IHBpcmF0ZTcgZnJvbSAnLi9hc3NldHMvc291bmRzL1BpcmF0ZURpYWxvZ3VlL2RlYWRNYW4ud2F2J1xyXG5cclxuY29uc3QgR2FtZUF1ZGlvID0gKGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgbXV0ZSA9IHRydWU7XHJcbiAgICBjb25zdCBtZW51ID0gbmV3IEF1ZGlvKG1lbnVNdXNpYyk7XHJcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBBdWRpbyhsZXZsZU11c2ljKTtcclxuICAgIGNvbnN0IGNvbWJhdCA9IG5ldyBBdWRpbyhjb21iYXRNdXNpYyk7XHJcbiAgICBjb25zdCBoaXQgPSBuZXcgQXVkaW8oaGl0U291bmQpOyBcclxuICAgIGNvbnN0IG1pc3MgPSBuZXcgQXVkaW8obWlzc1NvdW5kKTtcclxuICAgIGNvbnN0IHZpY3RvcnkgPSBuZXcgQXVkaW8odmljdG9yeVNvdW5kKTtcclxuICAgIGNvbnN0IGxvc2UgPSBuZXcgQXVkaW8obG9zZVNvdW5kKTtcclxuICAgIG1lbnUudm9sdW1lID0gMC43O1xyXG4gICAgY29tYmF0LnZvbHVtZSA9IDAuNTtcclxuXHJcbiAgICBjb25zdCBWX1NlbGVjdEQxID0gbmV3IEF1ZGlvKHZpa2luZzEpO1xyXG4gICAgY29uc3QgVl9TZWxlY3REMiA9IG5ldyBBdWRpbyh2aWtpbmcyKTtcclxuICAgIGNvbnN0IFZfU2VsZWN0RDMgPSBuZXcgQXVkaW8odmlraW5nMyk7XHJcbiAgICBjb25zdCBWX1NlbGVjdEQ0ID0gbmV3IEF1ZGlvKHZpa2luZzQpO1xyXG5cclxuICAgIGNvbnN0IFBfU2VsZWN0RDEgPSBuZXcgQXVkaW8ocGlyYXRlMSk7XHJcbiAgICBjb25zdCBQX1NlbGVjdEQyID0gbmV3IEF1ZGlvKHBpcmF0ZTIpO1xyXG4gICAgY29uc3QgUF9TZWxlY3REMyA9IG5ldyBBdWRpbyhwaXJhdGUzKTtcclxuICAgIGNvbnN0IFBfU2VsZWN0RDQgPSBuZXcgQXVkaW8ocGlyYXRlNCk7XHJcblxyXG4gICAgY29uc3QgVl9TdGFydCA9IG5ldyBBdWRpbyh2aWtpbmc1KTtcclxuICAgIGNvbnN0IFBfU3RhcnQgPSBuZXcgQXVkaW8ocGlyYXRlNSk7XHJcblxyXG4gICAgY29uc3QgUF9Mb3NlID0gbmV3IEF1ZGlvKHBpcmF0ZTYpO1xyXG4gICAgY29uc3QgUF9XaW4gPSBuZXcgQXVkaW8ocGlyYXRlNylcclxuICAgIGNvbnN0IFZfTG9zZSA9IG5ldyBBdWRpbyh2aWtpbmc2KTtcclxuICAgIGNvbnN0IFZfV2luID0gbmV3IEF1ZGlvKHZpa2luZzcpO1xyXG5cclxuICAgIGNvbnN0IGJnTXVzaWMgPSB7bWVudSwgc3RhZ2UsIGNvbWJhdCwgdmljdG9yeSwgbG9zZX07XHJcbiAgICBjb25zdCBkaWFsb2d1ZU9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aWtpbmdcIjoge1ZfU2VsZWN0RDEsIFZfU2VsZWN0RDIsIFZfU2VsZWN0RDMsIFZfU2VsZWN0RDR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBpcmF0ZVwiOiB7UF9TZWxlY3REMSwgUF9TZWxlY3REMiwgUF9TZWxlY3REMywgUF9TZWxlY3RENH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwbGF5U2VsZWN0RGlhbG9ndWUgPSAoY2hhcmFjdGVyKT0+e1xyXG4gICAgICAgIGlmKG11dGUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0b3BBbGxEaWFsb2d1ZXMoKTtcclxuICAgICAgICBsZXQgYXVkaW9OYW1lO1xyXG4gICAgICAgIGZvcihsZXQgY2ggaW4gZGlhbG9ndWVPYmope1xyXG4gICAgICAgICAgICBpZiAoY2ggPT09IGNoYXJhY3Rlcil7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdWRpb3MgPSBPYmplY3Qua2V5cyhkaWFsb2d1ZU9ialtjaF0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhdWRpb3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGF1ZGlvTmFtZSA9IGF1ZGlvc1tyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGRpYWxvZ3VlID0gIGRpYWxvZ3VlT2JqW2NoYXJhY3Rlcl1bYXVkaW9OYW1lXTtcclxuICAgICAgICBtZW51LnZvbHVtZSA9IDAuMzU7XHJcbiAgICAgICAgZGlhbG9ndWUucGxheSgpXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGlhbG9ndWUuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbWVudS52b2x1bWUgPSAwLjc7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdG9wRGlhbG9ndWUgPSAoY2hhcmFjdGVyLCBhdWRpb05hbWUpPT57XHJcbiAgICAgICAgY29uc3QgYXVkaW8gPSBkaWFsb2d1ZU9ialtjaGFyYWN0ZXJdW2F1ZGlvTmFtZV07XHJcbiAgICAgICAgaWYgKCFhdWRpby5wYXVzZWQpIHtcclxuICAgICAgICAgICAgYXVkaW8ucGF1c2UoKTtcclxuICAgICAgICAgICAgYXVkaW8uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHN0b3BBbGxEaWFsb2d1ZXMgPSAoKT0+e1xyXG4gICAgICAgIGZvciAobGV0IGNoYXJhY3RlciBpbiBkaWFsb2d1ZU9iaikge1xyXG4gICAgICAgICAgICBmb3IobGV0IGRpYWxvZ3VlIGluIGRpYWxvZ3VlT2JqW2NoYXJhY3Rlcl0pe1xyXG4gICAgICAgICAgICAgICAgc3RvcERpYWxvZ3VlKGNoYXJhY3RlciwgZGlhbG9ndWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lbnUudm9sdW1lID0gMC43OyAgICBcclxuICAgIH1cclxuICAgIGNvbnN0IHBsYXlCZ011c2ljID0gKGF1ZGlvTmFtZSwgaXNMb29wZWQgPSB0cnVlLCBmcm9tU3RhcnQgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgIGlmKG11dGUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0b3BBbGxCZ011c2ljKCk7XHJcbiAgICAgICAgY29uc3QgYXVkaW8gPSBiZ011c2ljW2F1ZGlvTmFtZV07XHJcbiAgICAgICAgYXVkaW8udm9sdW1lID0gMDsgLy8gU3RhcnQgd2l0aCB6ZXJvIHZvbHVtZVxyXG4gICAgICAgIGlmKGZyb21TdGFydCl7XHJcbiAgICAgICAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNMb29wZWQpe1xyXG4gICAgICAgICAgICBhdWRpby5sb29wID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGF1ZGlvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICBhdWRpby5wbGF5KCkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGVycm9yIGlmIHRoZSBwbGF5KCkgbWV0aG9kIGZhaWxzXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcGxheSBhdWRpbzonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZmFkZUR1cmF0aW9uID0gMjAwMDtcclxuICAgICAgICBsZXQgY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgIGNvbnN0IGZhZGVJbkludGVydmFsID0gNTA7IC8vIEFkanVzdCB0aGUgaW50ZXJ2YWwgZm9yIHNtb290aGVyIGZhZGluZ1xyXG4gICAgXHJcbiAgICAgICAgY29uc3QgZmFkZVN0ZXAgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lICs9IGZhZGVJbkludGVydmFsO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPCBmYWRlRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGF1ZGlvLnZvbHVtZSA9IChjdXJyZW50VGltZSAvIGZhZGVEdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZhZGVTdGVwLCBmYWRlSW5JbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhdWRpby52b2x1bWUgPSAxOyAvLyBFbnN1cmUgdm9sdW1lIGlzIGF0IG1heGltdW0gYXQgdGhlIGVuZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIFxyXG4gICAgICAgIGZhZGVTdGVwKCk7XHJcbiAgICB9O1xyXG4gICAgY29uc3Qgc3RvcEJnTXVzaWMgPSAoYXVkaW9OYW1lKT0+e1xyXG4gICAgICAgIGJnTXVzaWNbYXVkaW9OYW1lXS5wYXVzZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RvcEFsbEJnTXVzaWMgPSAoKT0+e1xyXG4gICAgICAgIGZvcihsZXQgYXVkaW8gaW4gYmdNdXNpYyl7XHJcbiAgICAgICAgICAgIHN0b3BCZ011c2ljKGF1ZGlvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBwbGF5U3RhcnREaWFsb2d1ZSA9IChjaGFyYWN0ZXIpPT57XHJcbiAgICAgICAgaWYobXV0ZSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoY2hhcmFjdGVyID09IFwidmlraW5nXCIpe1xyXG4gICAgICAgICAgICBsZXQgZGlhbG9ndWUgPSAgVl9TdGFydDtcclxuICAgICAgICAgICAgbWVudS52b2x1bWUgPSAwLjM1O1xyXG4gICAgICAgICAgICBkaWFsb2d1ZS5wbGF5KClcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IGRpYWxvZ3VlID0gIFBfU3RhcnQ7XHJcbiAgICAgICAgICAgIG1lbnUudm9sdW1lID0gMC4zNTtcclxuICAgICAgICAgICAgZGlhbG9ndWUucGxheSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcGxheUVuZERpYWxvZ3VlID0gKGNoYXJhY3Rlciwgd29uKT0+e1xyXG4gICAgICAgIGlmKG11dGUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbWJhdC52b2x1bWUgPSAwLjM1O1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZih3b24pe1xyXG4gICAgICAgICAgICAgICAgaWYoY2hhcmFjdGVyID09IFwicGlyYXRlXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWFsb2d1ZSA9ICBQX1dpbjtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9ndWUucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2d1ZS5vbmVuZGVkID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihjaGFyYWN0ZXIgPT0gXCJ2aWtpbmdcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpYWxvZ3VlID0gIFZfV2luO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2d1ZS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ3VlLm9uZW5kZWQgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKCF3b24pe1xyXG4gICAgICAgICAgICAgICAgaWYoY2hhcmFjdGVyID09IFwicGlyYXRlXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWFsb2d1ZSA9ICBQX0xvc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ3VlLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9ndWUub25lbmRlZCA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihjaGFyYWN0ZXIgPT0gXCJ2aWtpbmdcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpYWxvZ3VlID0gIFZfTG9zZTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9ndWUucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2d1ZS5vbmVuZGVkID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGF0dGFja0VmZmVjdHMgPSAoYXR0YWNrU3RhdHVzKSA9PiB7XHJcbiAgICAgICAgaWYobXV0ZSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGl0LnBhdXNlKCk7XHJcbiAgICAgICAgbWlzcy5wYXVzZSgpO1xyXG4gICAgICAgIGhpdC5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgbWlzcy5jdXJyZW50VGltZSA9IDA7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGF0dGFja1N0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGl0LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBoaXQub25lbmRlZCA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBtaXNzLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBtaXNzLm9uZW5kZWQgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpc0F1ZGlvQWxsb3dlZCA9IChjaGVjayk9PntcclxuICAgICAgICBtdXRlID0gIWNoZWNrO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG11dGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJue2lzQXVkaW9BbGxvd2VkLFxyXG4gICAgICAgIHBsYXlTZWxlY3REaWFsb2d1ZSxcclxuICAgICAgICBwbGF5U3RhcnREaWFsb2d1ZSwgXHJcbiAgICAgICAgcGxheUJnTXVzaWMsIFxyXG4gICAgICAgIHN0b3BCZ011c2ljLCBcclxuICAgICAgICBzdG9wQWxsRGlhbG9ndWVzLCBcclxuICAgICAgICBzdG9wRGlhbG9ndWUsIFxyXG4gICAgICAgIHBsYXlFbmREaWFsb2d1ZSxcclxuICAgICAgICBhdHRhY2tFZmZlY3RzLFxyXG4gICAgICAgIHN0b3BBbGxCZ011c2ljfVxyXG59KSgpO1xyXG5cclxuY29uc3QgVmlldyA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IHtcclxuICAgICAgICBcInRvcC1jYXJyaWVyXCI6W1sxNCwwXSxbMTUsMF0sWzE2LDBdLFsxNywwXSxbMTgsMF0sWzE0LDFdLFsxNSwxXSxbMTYsMV0sWzE3LDFdLFsxOCwxXV0sIFxyXG4gICAgICAgIFwidG9wLWJhdHRsZXNoaXBcIjpbWzYsMF0sWzcsMF0sWzgsMF0sWzksMF0sWzYsMV0sWzcsMV0sWzgsMV0sWzksMV1dLCBcclxuICAgICAgICBcInRvcC1jcnVpc2VyXCI6W1sxMCwyXSxbMTEsMl0sWzEyLDJdXSwgXHJcbiAgICAgICAgXCJ0b3Atc3VibWFyaW5lXCI6W1sxLDBdLCBbMiwwXSwgWzMsMF1dLCBcclxuICAgICAgICBcInRvcC1kZXN0cm95ZXJcIjpbWzEsMl0sIFsyLDJdXVxyXG4gICAgfVxyXG4gICAgY29uc3Qgc2hpcE5hbWVzID0gW1wiQ2FycmllclwiLCBcIkJhdHRsZXNoaXBcIiwgXCJDcnVpc2VyXCIsIFwiU3VibWFyaW5lXCIsIFwiRGVzdHJveWVyXCJdO1xyXG4gICAgY29uc3QgdG9nZ2xlTWVudU11c2ljID0gKCk9PntcclxuICAgICAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZvbEJ0bicpO1xyXG4gICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ZvbEltZ1wiKTtcclxuICAgICAgICBpZihidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwib2ZmXCIpKXtcclxuICAgICAgICAgICAgR2FtZUF1ZGlvLmlzQXVkaW9BbGxvd2VkKHRydWUpO1xyXG4gICAgICAgICAgICBHYW1lQXVkaW8ucGxheUJnTXVzaWMoXCJtZW51XCIpO1xyXG4gICAgICAgICAgICBpbWcuc3JjID0gdm9sdW1lT247XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QgPSBbXTtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJvblwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgR2FtZUF1ZGlvLmlzQXVkaW9BbGxvd2VkKGZhbHNlKTtcclxuICAgICAgICAgICAgR2FtZUF1ZGlvLnN0b3BCZ011c2ljKFwibWVudVwiKTtcclxuICAgICAgICAgICAgaW1nLnNyYyA9IHZvbHVtZU9mZjtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcIm9mZlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBmYWRlSW4gPSAoZWxlbWVudCwgZHVyYXRpb24pID0+IHtcclxuICAgICAgICB2YXIgb3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdmFyIGludGVydmFsID0gNTA7IC8vIEludGVydmFsIGluIG1pbGxpc2Vjb25kc1xyXG4gICAgICAgIHZhciBkZWx0YSA9IDEgLyAoZHVyYXRpb24gLyBpbnRlcnZhbCk7XHJcbiAgICBcclxuICAgICAgICB2YXIgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgb3BhY2l0eSArPSBkZWx0YTtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAob3BhY2l0eSA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGludGVydmFsKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc2V0U2VsZWN0U2NyZWVuID0gKCk9PntcclxuICAgICAgICBsZXQgY2hhcmFjdGVyQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VsZWN0XCIpO1xyXG4gICAgICAgIGNoYXJhY3RlckJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbmhlcml0XCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydEdhbWVcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICBHYW1lQXVkaW8uc3RvcEFsbERpYWxvZ3VlcygpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc2VsZWN0Q2hhcmFjdGVyID0gKGNoYXJhY3Rlcik9PntcclxuICAgICAgICByZXNldFNlbGVjdFNjcmVlbigpO1xyXG4gICAgICAgIGNoYXJhY3Rlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNFM0UzRTNcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N0YXJ0R2FtZVwiKS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIGlmKGNoYXJhY3Rlci5pZCA9PSBcInZpa2luZ1wiKXtcclxuICAgICAgICAgICAgR2FtZUF1ZGlvLnBsYXlTZWxlY3REaWFsb2d1ZShcInZpa2luZ1wiKTtcclxuICAgICAgICB9ZWxzZSBpZihjaGFyYWN0ZXIuaWQgPT0gXCJwaXJhdGVcIil7XHJcbiAgICAgICAgICAgIEdhbWVBdWRpby5wbGF5U2VsZWN0RGlhbG9ndWUoXCJwaXJhdGVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY2hhbmdlVG9HYW1lU2NyZWVuID0gKGNoYXJhY3Rlck5hbWUpPT57XHJcbiAgICAgICAgcmVzZXRTZWxlY3RTY3JlZW4oKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Nsb3NlTW9kYWxcIikuY2xpY2soKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZVNjcmVlblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnc0JhY2tncm91bmRcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBkaXNwbGF5Q2hhcmFjdGVycyhjaGFyYWN0ZXJOYW1lKVxyXG5cclxuICAgICAgICBjb25zdCBsZWZ0R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGVmdEdyaWRcIik7XHJcbiAgICAgICAgY29uc3QgcmlnaHRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWdodEdyaWRcIik7XHJcbiAgICAgICAgY29uc3QgdG9wQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0b3BHcmlkXCIpO1xyXG4gICAgICAgIGlmKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxlZnRDZWxsc1wiKSAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yaWdodENlbGxzXCIpICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvcENlbGxzXCIpKXtcclxuICAgICAgICAgICAgY29uc3RydWN0R3JpZChbMTAsMTBdLCBsZWZ0R3JpZCwgXCJsZWZ0Q2VsbHNcIik7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdEdyaWQoWzEwLDEwXSwgcmlnaHRHcmlkLCBcInJpZ2h0Q2VsbHNcIik7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdEdyaWQoWzMsMjBdLCB0b3BCYXIsIFwidG9wQ2VsbHNcIik7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBHYW1lQXVkaW8ucGxheUJnTXVzaWMoXCJzdGFnZVwiLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICBtYWtlUGxheWVyUmVhZHkoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvbnN0cnVjdEdyaWQgPSAoZGltZW5zaW9ucywgcGFyZW50RGl2LCBjZWxsQ2xhc3MpPT57XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1lbnNpb25zWzBdOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8ZGltZW5zaW9uc1sxXTsgaisrKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJncmlkQ2VsbFwiKTtcclxuICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNlbGxDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLWNvb3JkcycsICdfJyArIGogKyAnXycgKyBpKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBwYXJlbnREaXYuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5Q2hhcmFjdGVycyA9IChjaGFyYWN0ZXJOYW1lKT0+e1xyXG4gICAgICAgIGNvbnN0IHBsYXllckltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVySW1hZ2VcIik7XHJcbiAgICAgICAgY29uc3Qgb3BwSW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcHBvbmVudEltYWdlXCIpO1xyXG4gICAgICAgIGlmKGNoYXJhY3Rlck5hbWUgPT0gXCJ2aWtpbmdcIil7XHJcbiAgICAgICAgICAgIHBsYXllckltZy5zcmMgPSB2aWtpbmdJbWc7XHJcbiAgICAgICAgICAgIG9wcEltZy5zcmMgPSBwaXJhdGVJbWc7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHBsYXllckltZy5zcmMgPSBwaXJhdGVJbWc7XHJcbiAgICAgICAgICAgIG9wcEltZy5zcmMgPSB2aWtpbmdJbWc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wcEltZy5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGVYKC0xKSc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2VsbHNBZGRDbGFzcyA9IChjZWxscywgZ3JpZExlbmd0aCwgY29vcmRpbmF0ZXMsIGNlbGxDbGFzcyk9PntcclxuICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT57XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9ICtjb29yZGluYXRlWzFdKmdyaWRMZW5ndGggKyArY29vcmRpbmF0ZVswXTtcclxuICAgICAgICAgICAgY2VsbHNbaW5kZXhdLmNsYXNzTGlzdC5hZGQoY2VsbENsYXNzKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgY29uc3QgY2VsbHNSZW1vdmVDbGFzcyA9IChjZWxscywgZ3JpZExlbmd0aCwgY29vcmRpbmF0ZXMsIGNlbGxDbGFzcyk9PntcclxuICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT57XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9ICtjb29yZGluYXRlWzFdKmdyaWRMZW5ndGggKyArY29vcmRpbmF0ZVswXTtcclxuICAgICAgICAgICAgY2VsbHNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoY2VsbENsYXNzKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL21vdXNlZW50ZXIgYmVoYXZpb3VyIHRvIHNldCBob3ZlciBlZmZlY3RzXHJcbiAgICBjb25zdCB0b3BTaGlwc0hvdmVyID0gKHNoaXBJZCkgPT4ge1xyXG4gICAgICAgIGxldCBzaGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2hpcElkKTtcclxuICAgICAgICBpZihzaGlwLmNsYXNzTGlzdC5jb250YWlucyhcInNlbGVjdGVkXCIpIHx8IHNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFVuYXZhaWxhYmxlXCIpKXtcclxuICAgICAgICAgICAgcmV0dXJuOyAvL2Nhbid0IGhvdmVyIG92ZXIgc2hpcCBpZiBpdCdzIGN1cnJlbnRseSBzZWxlY3RlZCBvciBhbHJlYWR5IHBsYWNlZC5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzW3NoaXBJZF07XHJcbiAgICAgICAgbGV0IHRvcENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b3BDZWxsc1wiKVxyXG4gICAgICAgIGNlbGxzQWRkQ2xhc3ModG9wQ2VsbHMsIDIwLCBjb29yZGluYXRlcywgXCJjZWxsSG92ZXJcIik7XHJcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKFwic2hpcEhvdmVyXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vbW91c2VsZWF2ZSBiZWhhdmlvciB0byByZXNldCBob3ZlciBlZmZlY3RzXHJcbiAgICBjb25zdCB0b3BTaGlwc0RlZmF1bHQgPSAoc2hpcElkKT0+e1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzW3NoaXBJZF07XHJcbiAgICAgICAgbGV0IHRvcENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b3BDZWxsc1wiKVxyXG4gICAgICAgIGNlbGxzUmVtb3ZlQ2xhc3ModG9wQ2VsbHMsIDIwLCBjb29yZGluYXRlcywgXCJjZWxsSG92ZXJcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2hpcElkKS5jbGFzc0xpc3QucmVtb3ZlKFwic2hpcEhvdmVyXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY2xpY2sgYmVoYXZpb3IgdG8gc2hvdyBzaGlwIGlzIHNlbGVjdGVkLlxyXG4gICAgY29uc3QgdG9wU2hpcFNlbGVjdGVkID0gKHNoaXBJZCk9PntcclxuICAgICAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNoaXBJZCk7XHJcbiAgICAgICAgaWYoc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoXCJzZWxlY3RlZFwiKSB8fCBzaGlwLmNsYXNzTGlzdC5jb250YWlucyhcInNoaXBVbmF2YWlsYWJsZVwiKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9jYW4ndCBzZWxlY3Qgc2hpcCBpZiBpdCdzIGFscmVhZHkgc2VsZWN0ZWQgb3IgcGxhY2VkLlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRvcENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b3BDZWxsc1wiKVxyXG4gICAgICAgIC8vcmVzZXQgcHJldmlvdXMgc2hpcHMgdGhhdCBtaWdodCBoYXZlIGJlZW4gc2VsZWN0ZWQgYW5kIHVubWFyayBjb3JyZXNwb25kaW5nIGNlbGxzLiBcclxuICAgICAgICB1bnNlbGVjdFNoaXBzKCk7XHJcbiAgICAgICAgLy9zZWxlY3QgdGhlIHJlcXVpcmVkIHNoaXAsIG1hcmsgdGhlIGNlbGxzXHJcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzW3NoaXBJZF07XHJcbiAgICAgICAgY2VsbHNBZGRDbGFzcyh0b3BDZWxscywgMjAsIGNvb3JkaW5hdGVzLCBcImNlbGxTZWxlY3RlZFwiKTtcclxuICAgICAgICB0b3BTaGlwc0RlZmF1bHQoc2hpcElkKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzaGlwSWQpLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTsgLy90byBtYXJrIHRoZSBzaGlwIGFzIHNlbGVjdGVkLCBzbyBob3ZlciBlZmZlY3RzIGFyZSBpZ25vcmVkLlxyXG4gICAgICAgIGxldCBvcHRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vcHRpb25CdG5cIik7XHJcbiAgICAgICAgb3B0aW9uQnRucy5mb3JFYWNoKG9wdGlvbkJ0biA9PntcclxuICAgICAgICAgICAgb3B0aW9uQnRuLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHVuc2VsZWN0U2hpcHMgPSAoKT0+e1xyXG4gICAgICAgIGxldCBvcHRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vcHRpb25CdG5cIik7XHJcbiAgICAgICAgb3B0aW9uQnRucy5mb3JFYWNoKG9wdGlvbkJ0biA9PntcclxuICAgICAgICAgICAgb3B0aW9uQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHRvcENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b3BDZWxsc1wiKVxyXG4gICAgICAgIGxldCBjb29yZGluYXRlcztcclxuICAgICAgICBmb3IobGV0IHNoaXBOYW1lIGluIHNoaXBDb29yZGluYXRlcyl7XHJcbiAgICAgICAgICAgIGxldCBzaGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2hpcE5hbWUpO1xyXG4gICAgICAgICAgICBjb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlc1tzaGlwTmFtZV07XHJcbiAgICAgICAgICAgIGlmKHNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VsZWN0ZWRcIikpe1xyXG4gICAgICAgICAgICAgICAgY2VsbHNSZW1vdmVDbGFzcyh0b3BDZWxscywgMjAsIGNvb3JkaW5hdGVzLCBcImNlbGxTZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpOyAvL3Vuc2VsZWN0IHRoZSBzaGlwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9wU2hpcFVuYXZhaWxhYmxlID0gKGxlZnRTaGlwKT0+e1xyXG4gICAgICAgIGxldCB0b3BDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9wQ2VsbHNcIik7XHJcbiAgICAgICAgbGV0IHRvcFNoaXAgPSBsZWZ0U2hpcC5pZC5yZXBsYWNlKFwibGVmdFwiLCBcInRvcFwiKTtcclxuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXNbdG9wU2hpcF07XHJcblxyXG4gICAgICAgIGNlbGxzUmVtb3ZlQ2xhc3ModG9wQ2VsbHMsIDIwLCBjb29yZGluYXRlcywgXCJjZWxsSG92ZXJcIik7XHJcbiAgICAgICAgY2VsbHNBZGRDbGFzcyh0b3BDZWxscywgMjAsIGNvb3JkaW5hdGVzLCBcImNlbGxVbmF2YWlsYWJsZVwiKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b3BTaGlwKS5jbGFzc0xpc3QuYWRkKFwic2hpcFVuYXZhaWxhYmxlXCIpO1xyXG4gICAgICAgIHVuc2VsZWN0U2hpcHMoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRvcFNoaXBBdmFpbGFibGUgPSAobGVmdFNoaXApPT57XHJcbiAgICAgICAgbGV0IHRvcENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b3BDZWxsc1wiKTtcclxuICAgICAgICBsZXQgdG9wU2hpcCA9IGxlZnRTaGlwLmlkLnJlcGxhY2UoXCJsZWZ0XCIsIFwidG9wXCIpO1xyXG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlc1t0b3BTaGlwXTtcclxuICAgICAgICBjZWxsc1JlbW92ZUNsYXNzKHRvcENlbGxzLCAyMCwgY29vcmRpbmF0ZXMsIFwiY2VsbFVuYXZhaWxhYmxlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvcFNoaXApLmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwVW5hdmFpbGFibGVcIik7XHJcbiAgICAgICAgdG9wU2hpcHNEZWZhdWx0KHRvcFNoaXApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbG9yUGxhY2VtZW50ID0gKHNoaXBDb29yZGluYXRlcywgaXNWYWxpZFBsYWNtZW50KT0+e1xyXG4gICAgICAgIGxldCBsZWZ0Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxlZnRDZWxsc1wiKVxyXG4gICAgICAgIGlmKGlzVmFsaWRQbGFjbWVudCl7XHJcbiAgICAgICAgICAgIGNlbGxzQWRkQ2xhc3MobGVmdENlbGxzLCAxMCwgc2hpcENvb3JkaW5hdGVzLCBcInZhbGlkUGxhY2VtZW50XCIpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNlbGxzQWRkQ2xhc3MobGVmdENlbGxzLCAxMCwgc2hpcENvb3JkaW5hdGVzLCBcImludmFsaWRQbGFjZW1lbnRcIik7ICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgdW5jb2xvclBsYWNlbWVudCA9IChzaGlwQ29vcmRpbmF0ZXMpPT57XHJcbiAgICAgICAgbGV0IGxlZnRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubGVmdENlbGxzXCIpO1xyXG4gICAgICAgIGNlbGxzUmVtb3ZlQ2xhc3MobGVmdENlbGxzLCAxMCwgc2hpcENvb3JkaW5hdGVzLCBcInZhbGlkUGxhY2VtZW50XCIpO1xyXG4gICAgICAgIGNlbGxzUmVtb3ZlQ2xhc3MobGVmdENlbGxzLCAxMCwgc2hpcENvb3JkaW5hdGVzLCBcImludmFsaWRQbGFjZW1lbnRcIik7XHJcblxyXG4gICAgfVxyXG4gICAgY29uc3QgdHJpZ2dlclJvdGF0aW9uID0gKHJvdGF0ZUJ0biwgZGlyZWN0aW9uKT0+e1xyXG4gICAgICAgIGlmKGRpcmVjdGlvbiA9PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgICAgIHJvdGF0ZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiaG9yaXpvbnRhbFwiKTtcclxuICAgICAgICAgICAgcm90YXRlQnRuLmNsYXNzTGlzdC5hZGQoXCJ2ZXJ0aWNhbFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcm90YXRlQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJ2ZXJ0aWNhbFwiKTtcclxuICAgICAgICAgICAgcm90YXRlQnRuLmNsYXNzTGlzdC5hZGQoXCJob3Jpem9udGFsXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBsYWNlRW5lbXlTaGlwID0gKGNlbGxzLCBzaGlwcywgc2hpcFBvcywgZGlyZWN0aW9uLCBzaGlwTmFtZSk9PnsgICBcclxuICAgICAgIHBsYWNlU2hpcChjZWxscywgc2hpcHMsIHNoaXBQb3MsIGRpcmVjdGlvbiwgc2hpcE5hbWUsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBsYWNlUGxheWVyU2hpcCA9IChjZWxscywgc2hpcHMsIHNoaXBQb3MsIGRpcmVjdGlvbiwgc2hpcE5hbWUsIGFsbFNoaXBzUGxhY2VkKT0+eyAgIFxyXG4gICAgICAgcGxhY2VTaGlwKGNlbGxzLCBzaGlwcywgc2hpcFBvcywgZGlyZWN0aW9uLCBzaGlwTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgc2hpcHMuZm9yRWFjaChzaGlwPT57XHJcbiAgICAgICAgICAgIGlmKHNoaXBOYW1lID09IHNoaXAuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaGlwLXR5cGVcIikpe1xyXG4gICAgICAgICAgICAgICAgdG9wU2hpcFVuYXZhaWxhYmxlKHNoaXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZihhbGxTaGlwc1BsYWNlZCl7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVhZHlHYW1lXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXNldEJvYXJkXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIilcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgcGxhY2VTaGlwID0gKGNlbGxzLCBzaGlwcywgc2hpcFBvcywgZGlyZWN0aW9uLCBzaGlwTmFtZSwgdmlld2FibGUpPT57ICAgXHJcbiAgICAgICAgY2VsbHNSZW1vdmVDbGFzcyhjZWxscywgMTAsIHNoaXBQb3MsIFwidmFsaWRQbGFjZW1lbnRcIik7XHJcbiAgICAgICAgc2hpcHMuZm9yRWFjaChzaGlwPT57XHJcbiAgICAgICAgICAgIGlmKHNoaXBOYW1lID09IHNoaXAuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaGlwLXR5cGVcIikpe1xyXG4gICAgICAgICAgICAgICAgc2hpcC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIlxyXG4gICAgICAgICAgICAgICAgc2hpcC5zdHlsZS5sZWZ0ID0gXCJjYWxjKFwiICsgc2hpcFBvc1swXVswXSArIFwiKnZhcigtLWNlbGwtc2l6ZSkgKyAxcHgpXCJcclxuICAgICAgICAgICAgICAgIHNoaXAuc3R5bGUudG9wID0gIFwiY2FsYyhcIiArIHNoaXBQb3NbMF1bMV0gKyBcIip2YXIoLS1jZWxsLXNpemUpICsgMXB4KVwiXHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZGlyZWN0aW9uID09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdGF0ZU9mZnNldCA9IFwiKFwiICsgc2hpcC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdpZHRoXCIpICsgXCIgKiB2YXIoLS1jZWxsLXNpemUpLzIpXCJcclxuICAgICAgICAgICAgICAgICAgICBzaGlwLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IFwiY2FsYyhcIiArIHJvdGF0ZU9mZnNldCtcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoXCJ2ZXJ0aWNhbFNoaXBcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZighdmlld2FibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXAuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc2V0Qm9hcmQgPSAoKT0+e1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzZXRCb2FyZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVhZHlHYW1lXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIilcclxuICAgICAgICBsZXQgcGxheWVyU2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxlZnRTaGlwc1wiKTtcclxuICAgICAgICBwbGF5ZXJTaGlwcy5mb3JFYWNoKHNoaXA9PntcclxuICAgICAgICAgICAgc2hpcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShcInZlcnRpY2FsU2hpcFwiKTtcclxuICAgICAgICAgICAgdG9wU2hpcEF2YWlsYWJsZShzaGlwKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGxldCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JvdGF0ZVwiKTtcclxuICAgICAgICByb3RhdGVCdG4uY2xhc3NMaXN0LnJlbW92ZShcInZlcnRpY2FsXCIpO1xyXG4gICAgICAgIHJvdGF0ZUJ0bi5jbGFzc0xpc3QuYWRkKFwiaG9yaXpvbnRhbFwiKVxyXG4gICAgfVxyXG4gICAgY29uc3QgbWFrZUNwdVJlYWR5ID0gKCk9PntcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dzTGVmdFwiKS5jbGFzc0xpc3QuYWRkKFwid2FpdFwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dzUmlnaHRcIikuY2xhc3NMaXN0LnJlbW92ZShcIndhaXRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWdodEdyaWRcIikuY2xhc3NMaXN0LmFkZChcImNyb3NzaGFpclwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JpZ2h0R3JpZFwiKS5jbGFzc0xpc3QuYWRkKFwiaG92ZXJhYmxlXCIpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbWFrZVBsYXllclJlYWR5ID0gKCk9PntcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dzTGVmdFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwid2FpdFwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dzUmlnaHRcIikuY2xhc3NMaXN0LmFkZChcIndhaXRcIik7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydCA9IChjaGFyYWN0ZXIpPT57XHJcbiAgICAgICAgbGV0IHJlYWR5R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVhZHlHYW1lXCIpO1xyXG4gICAgICAgIGxldCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzZXRCb2FyZFwiKTtcclxuICAgICAgICByZWFkeUdhbWVCdG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICByZXNldEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIHJlYWR5R2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgcmVzZXRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIEdhbWVBdWRpby5wbGF5QmdNdXNpYyhcImNvbWJhdFwiLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICBHYW1lQXVkaW8ucGxheVN0YXJ0RGlhbG9ndWUoY2hhcmFjdGVyKTtcclxuICAgICAgICBtYWtlQ3B1UmVhZHkoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGhvdmVyUmlnaHRDZWxsID0gKGNlbGwpPT57XHJcbiAgICAgICAgaWYoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwidW5ob3ZlcmFibGVcIikgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWdodEdyaWRcIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaG92ZXJhYmxlXCIpKXtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJhYmxlXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHVuaG92ZXJSaWdodENlbGwgPSAoY2VsbCk9PntcclxuICAgICAgICBpZihjZWxsLmNsYXNzTGlzdC5jb250YWlucyhcImhvdmVyYWJsZVwiKSl7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyYWJsZVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZWNlaXZlQXR0YWNrID0gYXN5bmMgKGNvb3JkcywgYXR0YWNrU3RhdHVzLCByZWNpZXZlcikgPT4ge1xyXG4gICAgICAgIGxldCB0YXJnZXRDZWxsO1xyXG4gICAgICAgIGxldCBwYXJzZWRDb29yZHMgPSAnXycgKyBjb29yZHNbMF0gKyAnXycgKyBjb29yZHNbMV07XHJcbiAgICAgICAgaWYgKHJlY2lldmVyID09IFwiY3B1XCIpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Q2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlnaHRHcmlkXCIpLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb29yZHM9XCIgKyBwYXJzZWRDb29yZHMgKyBcIl1cIik7XHJcbiAgICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcInVuaG92ZXJhYmxlXCIpO1xyXG4gICAgICAgICAgICB1bmhvdmVyUmlnaHRDZWxsKHRhcmdldENlbGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhcmdldENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xlZnRHcmlkXCIpLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb29yZHM9XCIgKyBwYXJzZWRDb29yZHMgKyBcIl1cIik7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgaWYgKGF0dGFja1N0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJnZXRDZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihyZWNpZXZlcj09XCJjcHVcIil7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ3NMZWZ0XCIpLmNsYXNzTGlzdC5hZGQoXCJ3YWl0XCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JpZ2h0R3JpZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY3Jvc3NoYWlyXCIpIC8vIHNldCB0aGUgY3Vyc29yIHRvIGRlZmF1bHRcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWdodEdyaWRcIikuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyYWJsZVwiKSAvLyByZW1vdmUgY2VsbCBob3ZlciBlZmZlY3RcclxuICAgICAgICAgICAgYXdhaXQgR2FtZUF1ZGlvLmF0dGFja0VmZmVjdHMoYXR0YWNrU3RhdHVzKTtcclxuICAgICAgICAgICAgbWFrZVBsYXllclJlYWR5KCk7XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dzUmlnaHRcIikuY2xhc3NMaXN0LmFkZChcIndhaXRcIik7XHJcbiAgICAgICAgICAgIGF3YWl0IEdhbWVBdWRpby5hdHRhY2tFZmZlY3RzKGF0dGFja1N0YXR1cyk7XHJcbiAgICAgICAgICAgIG1ha2VDcHVSZWFkeSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBjb25zdCBzaG93U3Vua2VuRW5lbXkgPSAoc3Vua2VuU2hpcE5hbWUsIHJpZ2h0Q2VsbHMsIGNwdVNoaXBzLCBzaGlwT2JqKT0+e1xyXG4gICAgICAgIHBsYWNlRW5lbXlTaGlwKHJpZ2h0Q2VsbHMsIGNwdVNoaXBzLCBzaGlwT2JqLmNvb3JkaW5hdGVzLCBzaGlwT2JqLmRpcmVjdGlvbiwgc3Vua2VuU2hpcE5hbWUsIHRydWUpO1xyXG4gICAgICAgIGxldCByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlnaHRCb2FyZENvbnRhaW5lclwiKVxyXG4gICAgICAgIHJpZ2h0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1zaGlwLXR5cGU9XCIgKyBzdW5rZW5TaGlwTmFtZSArIFwiXVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3RhcnRHYW1lID0gKCk9PntcclxuICAgICAgICBsZXQgcmVhZHlHYW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZWFkeUdhbWVcIik7XHJcbiAgICAgICAgbGV0IHJlc2V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXNldEJvYXJkXCIpO1xyXG4gICAgICAgIHJlYWR5R2FtZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIHJlc2V0QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgcmVhZHlHYW1lQnRuLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgICAgIHJlc2V0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgICAgIHJlc2V0Qm9hcmQoKTtcclxuICAgICAgICBsZXQgcmlnaHRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucmlnaHRDZWxsc1wiKTtcclxuICAgICAgICBsZXQgbGVmdENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sZWZ0Q2VsbHNcIik7XHJcbiAgICAgICAgcmlnaHRDZWxscy5mb3JFYWNoKGNlbGw9PntcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJtaXNzXCIpO1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJ1bmhvdmVyYWJsZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZWZ0Q2VsbHMuZm9yRWFjaChjZWxsPT57XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImhpdFwiKTtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwibWlzc1wiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtYWtlUGxheWVyUmVhZHkoKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JpZ2h0R3JpZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY3Jvc3NoYWlyXCIpIC8vIHJldHVybiB0byBkZWZhdWx0IGN1cnNvclxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlnaHRHcmlkXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmFibGVcIikgLy8gcmVtb3ZlIGNlbGwgaG92ZXIgZWZmZWN0XHJcblxyXG4gICAgICAgIGxldCByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlnaHRCb2FyZENvbnRhaW5lclwiKVxyXG4gICAgICAgIHNoaXBOYW1lcy5mb3JFYWNoKG5hbWU9PntcclxuICAgICAgICAgICAgbGV0IHNoaXAgPSByaWdodENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtc2hpcC10eXBlPVwiICsgbmFtZSArIFwiXVwiKVxyXG4gICAgICAgICAgICBzaGlwLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKFwidmVydGljYWxTaGlwXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgR2FtZUF1ZGlvLnBsYXlCZ011c2ljKFwic3RhZ2VcIiwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBjb25zdCBnYW1lT3ZlclNjcmVlbiA9IGFzeW5jIChjaGFyYWN0ZXIsIHdpbm5lcik9PntcclxuICAgICAgICAvLyBHZXQgdGhlIG1vZGFsIGVsZW1lbnRcclxuICAgICAgICBpZih3aW5uZXIgPT0gXCJjcHVcIil7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdWx0c01vZGFsSGVhZGluZ1wiKS50ZXh0Q29udGVudCA9IFwiREVGRUFUXCJcclxuICAgICAgICAgICAgYXdhaXQgR2FtZUF1ZGlvLnBsYXlFbmREaWFsb2d1ZShjaGFyYWN0ZXIsIGZhbHNlKTtcclxuICAgICAgICAgICAgR2FtZUF1ZGlvLnBsYXlCZ011c2ljKFwibG9zZVwiLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdWx0c01vZGFsSGVhZGluZ1wiKS50ZXh0Q29udGVudCA9IFwiVklDVE9SWVwiXHJcbiAgICAgICAgICAgIGF3YWl0IEdhbWVBdWRpby5wbGF5RW5kRGlhbG9ndWUoY2hhcmFjdGVyLCB0cnVlKTtcclxuICAgICAgICAgICAgR2FtZUF1ZGlvLnBsYXlCZ011c2ljKFwidmljdG9yeVwiLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGdhbWVPdmVyTW9kYWwgPSBuZXcgYm9vdHN0cmFwLk1vZGFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzTW9kYWwnKSk7XHJcbiAgICAgICAgZ2FtZU92ZXJNb2RhbC5zaG93KCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjaGFuZ2VUb01haW5NZW51ID0gKCk9PntcclxuICAgICAgICByZXN0YXJ0R2FtZSgpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lU2NyZWVuXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dzQmFja2dyb3VuZFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2b2xCdG4nKTtcclxuICAgICAgICBpZihidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwib25cIikpe1xyXG4gICAgICAgICAgICBHYW1lQXVkaW8ucGxheUJnTXVzaWMoXCJtZW51XCIsIHRydWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHNob3dBdWRpb01vZGFsID0gKCk9PntcclxuICAgICAgICBjb25zdCBhdWRpb01vZGFsID0gbmV3IGJvb3RzdHJhcC5Nb2RhbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW9Nb2RhbCcpKTtcclxuICAgICAgICBhdWRpb01vZGFsLnNob3coKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHNldE11dGUgPSAoaXNNdXRlKT0+e1xyXG4gICAgICAgIGlmICghaXNNdXRlKXtcclxuICAgICAgICAgICAgdG9nZ2xlTWVudU11c2ljKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtzaG93QXVkaW9Nb2RhbCxcclxuICAgICAgICBzZXRNdXRlLFxyXG4gICAgICAgIGZhZGVJbiwgXHJcbiAgICAgICAgdG9nZ2xlTWVudU11c2ljLCBcclxuICAgICAgICBzZWxlY3RDaGFyYWN0ZXIsIFxyXG4gICAgICAgIHJlc2V0U2VsZWN0U2NyZWVuLCBcclxuICAgICAgICBjaGFuZ2VUb0dhbWVTY3JlZW4sIFxyXG4gICAgICAgIHRvcFNoaXBzRGVmYXVsdCwgXHJcbiAgICAgICAgdG9wU2hpcHNIb3ZlcixcclxuICAgICAgICB0b3BTaGlwU2VsZWN0ZWQsXHJcbiAgICAgICAgdW5zZWxlY3RTaGlwcyxcclxuICAgICAgICBjb2xvclBsYWNlbWVudCxcclxuICAgICAgICB1bmNvbG9yUGxhY2VtZW50LFxyXG4gICAgICAgIHRyaWdnZXJSb3RhdGlvbixcclxuICAgICAgICBwbGFjZUVuZW15U2hpcCxcclxuICAgICAgICBwbGFjZVBsYXllclNoaXAsXHJcbiAgICAgICAgcmVzZXRCb2FyZCxcclxuICAgICAgICBob3ZlclJpZ2h0Q2VsbCxcclxuICAgICAgICB1bmhvdmVyUmlnaHRDZWxsLFxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2ssXHJcbiAgICAgICAgc2hvd1N1bmtlbkVuZW15LFxyXG4gICAgICAgIGdhbWVPdmVyU2NyZWVuLFxyXG4gICAgICAgIHJlc3RhcnRHYW1lLFxyXG4gICAgICAgIGNoYW5nZVRvTWFpbk1lbnUsXHJcbiAgICAgICAgc3RhcnQsXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWaWV3OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgKCFzY3JpcHRVcmwgfHwgIS9eaHR0cChzPyk6Ly50ZXN0KHNjcmlwdFVybCkpKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0ICcuL3N0eWxlcy5jc3MnXHJcbmltcG9ydCAnLi9nc1N0eWxlcy5jc3MnXHJcbmltcG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfSBmcm9tICcuL21vZGVsLmpzJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3LmpzJ1xyXG5cclxuY29uc3QgQ29udHJvbGxlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IEhvcml6b250YWwgPSBcImhvcml6b250YWxcIjtcclxuICAgIGNvbnN0IFZlcnRpY2FsID0gXCJ2ZXJ0aWNhbFwiO1xyXG4gICAgbGV0IGNoYXJhY3RlclNlbGVjdGVkO1xyXG4gICAgbGV0IHNoaXBTZWxlY3RlZDtcclxuICAgIGxldCBkaXJlY3Rpb24gPSBIb3Jpem9udGFsO1xyXG4gICAgbGV0IHBsYXllcjEgPSBQbGF5ZXIoKTtcclxuICAgIGxldCBjcHUgPSBDb21wdXRlcigpO1xyXG4gICAgbGV0IHR1cm4gPSAxO1xyXG4gICAgbGV0IGdhbWVTdGFydCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IHNldERpcmVjdGlvbiA9IChkaXIpID0+e1xyXG4gICAgICAgIGlmKGRpciAhPSBIb3Jpem9udGFsICYmIGRpciAhPSBWZXJ0aWNhbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5jb3JyZWN0IGRpcmVjdGlvbiBwYXNzZWQgXCIgKyBkaXIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlyZWN0aW9uID0gZGlyO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZ2V0RGlyZWN0aW9uID0gKCk9PntcclxuICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZ2V0VHVybiA9ICgpPT57XHJcbiAgICAgICAgaWYodHVybiA9PSAxKXtcclxuICAgICAgICAgICAgcmV0dXJuIFwiUGxheWVyXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIkNQVVwiO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc2V0Q2hhcmFjdGVyID0gKGNoYXIpPT57XHJcbiAgICAgICAgY2hhcmFjdGVyU2VsZWN0ZWQgPSBjaGFyO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZ2V0Q2hhcmFjdGVyID0gKCk9PntcclxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyU2VsZWN0ZWQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZXRTaGlwID0gKHNoaXApPT57XHJcbiAgICAgICAgc2hpcFNlbGVjdGVkID0gc2hpcDsgXHJcbiAgICB9XHJcbiAgICBjb25zdCBnZXRTaGlwID0gKCk9PntcclxuICAgICAgICByZXR1cm4gc2hpcFNlbGVjdGVkO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzZXRCb2FyZCA9ICgpPT57XHJcbiAgICAgICAgcGxheWVyMS5yZXNldEJvYXJkKCk7XHJcbiAgICAgICAgVmlldy5yZXNldEJvYXJkKCk7XHJcbiAgICAgICAgc2hpcFNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICBkaXJlY3Rpb24gPSBIb3Jpem9udGFsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY2hhbmdlVHVybiA9ICgpPT57XHJcbiAgICAgICAgaWYodHVybiA9PSAxKXtcclxuICAgICAgICAgICAgdHVybiA9IDI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHR1cm4gPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGNoZWNrR2FtZU92ZXIgPSBhc3luYyAoYWN0b3IpPT57IFxyXG4gICAgICAgIGxldCBhY3RvcldvbiA9IGZhbHNlO1xyXG4gICAgICAgIGlmKGFjdG9yID09IFwiY3B1XCIpe1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIxLmFyZVNoaXBzU3VuaygpID09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgYWN0b3JXb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGlmKGNwdS5hcmVTaGlwc1N1bmsoKSA9PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGFjdG9yV29uID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFjdG9yV29uKXtcclxuICAgICAgICAgICAgYXdhaXQgVmlldy5nYW1lT3ZlclNjcmVlbihnZXRDaGFyYWN0ZXIoKSxhY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhY3RvcldvbjtcclxuICAgIH1cclxuICAgIGNvbnN0IGNwdU1vdmUgPSBhc3luYyAoKT0+e1xyXG4gICAgICAgIGxldCBbY29vcmRzLCBhdHRhY2tTdGF0dXNdID0gY3B1Lm1ha2VNb3ZlKHBsYXllcjEpO1xyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA3NTApKTtcclxuICAgICAgICBhd2FpdCBWaWV3LnJlY2VpdmVBdHRhY2soY29vcmRzLCBhdHRhY2tTdGF0dXMsIFwicGxheWVyXCIpO1xyXG4gICAgICAgIGF3YWl0IGNoZWNrR2FtZU92ZXIoXCJjcHVcIik7XHJcbiAgICAgICAgY2hhbmdlVHVybigpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGxheWVyTW92ZSA9IGFzeW5jIChlKT0+e1xyXG4gICAgICAgIGlmKGdldFR1cm4oKSA9PSBcIlBsYXllclwiKXtcclxuICAgICAgICAgICAgbGV0IGNvb3JkcyA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtY29vcmRzXCIpLm1hdGNoKC9fKFxcZCspXyhcXGQrKS8pLm1hcChOdW1iZXIpO1xyXG4gICAgICAgICAgICBpZiAoY29vcmRzKSB7XHJcbiAgICAgICAgICAgICAgICBjb29yZHMgPSBjb29yZHMuc2xpY2UoMSkubWFwKE51bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGF0dGFja1N0YXR1cyA9IGNwdS5yZWNlaXZlQXR0YWNrKGNvb3Jkcyk7XHJcbiAgICAgICAgICAgIGlmKGF0dGFja1N0YXR1cyAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlVHVybigpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgVmlldy5yZWNlaXZlQXR0YWNrKGNvb3JkcywgYXR0YWNrU3RhdHVzLCBcImNwdVwiKTtcclxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDApKTtcclxuICAgICAgICAgICAgICAgIGxldCByaWdodENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5yaWdodENlbGxzXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNwdVNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5yaWdodFNoaXBzXCIpOyAgICBcclxuICAgICAgICAgICAgICAgIGlmKGF0dGFja1N0YXR1cyA9PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3Vua2VuU2hpcHMgPSBjcHUuZ2V0U3Vua2VuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNwdUZsZWV0ID0gY3B1LmdldEZsZWV0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vua2VuU2hpcHMuZm9yRWFjaChzdW5rZW5TaGlwTmFtZSA9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPYmogPSBjcHVGbGVldFtzdW5rZW5TaGlwTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFZpZXcuc2hvd1N1bmtlbkVuZW15KHN1bmtlblNoaXBOYW1lLCByaWdodENlbGxzLCBjcHVTaGlwcywgc2hpcE9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzR2FtZU92ZXIgPSBhd2FpdCBjaGVja0dhbWVPdmVyKFwicGxheWVyXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoIWlzR2FtZU92ZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwdU1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjcHVGbGVldCA9IGNwdS5nZXRGbGVldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgc2hpcE5hbWUgaW4gY3B1RmxlZXQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcE9iaiA9IGNwdUZsZWV0W3NoaXBOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmlldy5zaG93U3Vua2VuRW5lbXkoc2hpcE5hbWUsIHJpZ2h0Q2VsbHMsIGNwdVNoaXBzLCBzaGlwT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXN0YXJ0R2FtZSA9ICgpPT57XHJcbiAgICAgICAgcmVzZXRCb2FyZCgpO1xyXG4gICAgICAgIHBsYXllcjEucmVzZXRCb2FyZCgpO1xyXG4gICAgICAgIGNwdS5yZXNldEJvYXJkKCk7XHJcbiAgICAgICAgdHVybiA9IDE7XHJcbiAgICAgICAgZ2FtZVN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgVmlldy5yZXN0YXJ0R2FtZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZW5kR2FtZSA9ICgpPT57XHJcbiAgICAgICAgcmVzdGFydEdhbWUoKTtcclxuICAgICAgICBWaWV3LmNoYW5nZVRvTWFpbk1lbnUoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGluaXQgPSAoKT0+e1xyXG4gICAgICAgIGNvbnN0IGZsYWdHaWYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxhZycpO1xyXG4gICAgICAgIFZpZXcuZmFkZUluKGZsYWdHaWYsIDUwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZvbHVtZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2b2xCdG4nKTtcclxuICAgICAgICB2b2x1bWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcclxuICAgICAgICAgICAgVmlldy50b2dnbGVNZW51TXVzaWMoKTtcclxuICAgICAgICB9KVxyXG4gICAgXHJcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VsZWN0XCIpO1xyXG4gICAgICAgIGNoYXJhY3RlckJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcclxuICAgICAgICAgICAgICAgIFZpZXcuc2VsZWN0Q2hhcmFjdGVyKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHNldENoYXJhY3RlcihlLnRhcmdldC5pZCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIFxyXG4gICAgICAgIGNvbnN0IGNsb3NlTW9kYWxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Nsb3NlTW9kYWxcIik7XHJcbiAgICAgICAgY2xvc2VNb2RhbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIFZpZXcucmVzZXRTZWxlY3RTY3JlZW4pO1xyXG4gICAgXHJcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwnKTtcclxuICAgICAgICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBpc0NsaWNrSW5zaWRlTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGVudCcpLmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgIGlmICghaXNDbGlja0luc2lkZU1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgIFZpZXcucmVzZXRTZWxlY3RTY3JlZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0QnJuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0R2FtZScpO1xyXG4gICAgICAgIHN0YXJ0QnJuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBpZihldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKXtcclxuICAgICAgICAgICAgICAgIFZpZXcuY2hhbmdlVG9HYW1lU2NyZWVuKGdldENoYXJhY3RlcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCB0b3BTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9wU2hpcHNcIik7XHJcbiAgICAgICAgdG9wU2hpcHMuZm9yRWFjaChzaGlwID0+e1xyXG4gICAgICAgICAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgIFZpZXcudG9wU2hpcHNIb3ZlcihldmVudC50YXJnZXQuaWQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgIFZpZXcudG9wU2hpcHNEZWZhdWx0KGV2ZW50LnRhcmdldC5pZCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGFibGUgPSBWaWV3LnRvcFNoaXBTZWxlY3RlZChlLnRhcmdldC5pZCk7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxlY3RhYmxlKXtcclxuICAgICAgICAgICAgICAgICAgICBzZXRTaGlwKGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtc2hpcC10eXBlXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGxldCB1bnNlbGVjdFNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbmNlbFwiKTtcclxuICAgICAgICBsZXQgcm90YXRlU2hpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm90YXRlXCIpO1xyXG4gICAgICAgIHVuc2VsZWN0U2hpcC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIFZpZXcudW5zZWxlY3RTaGlwcygpO1xyXG4gICAgICAgICAgICBzZXRTaGlwKG51bGwpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcm90YXRlU2hpcC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGlmKGdldFNoaXAoKSAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIFZpZXcudHJpZ2dlclJvdGF0aW9uKGUudGFyZ2V0LCBnZXREaXJlY3Rpb24oKSk7XHJcbiAgICAgICAgICAgICAgICBpZihnZXREaXJlY3Rpb24oKSA9PSBIb3Jpem9udGFsKXtcclxuICAgICAgICAgICAgICAgICAgICBzZXREaXJlY3Rpb24oVmVydGljYWwpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0RGlyZWN0aW9uKEhvcml6b250YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHJlc2V0Qm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc2V0Qm9hcmRcIik7XHJcbiAgICAgICAgcmVzZXRCb2FyZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSl7XHJcbiAgICAgICAgICAgICAgICByZXNldEJvYXJkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBsZXQgcmVhZHlHYW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZWFkeUdhbWVcIik7XHJcbiAgICAgICAgcmVhZHlHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKXtcclxuICAgICAgICAgICAgICAgIGNwdS5wbGFjZVNoaXBzKCk7XHJcbiAgICAgICAgICAgICAgICBWaWV3LnN0YXJ0KGdldENoYXJhY3RlcigpKTtcclxuICAgICAgICAgICAgICAgIGdhbWVTdGFydCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgXHJcbiAgICAgICAgbGV0IGxlZnRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsZWZ0R3JpZFwiKVxyXG4gICAgICAgIGxlZnRHcmlkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBsZXQgbGVmdENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sZWZ0Q2VsbHNcIik7XHJcbiAgICAgICAgICAgIGxlZnRDZWxscy5mb3JFYWNoKGNlbGwgPT57XHJcbiAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGdldFNoaXAoKSAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFssIHgsIHldID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZHNcIikubWF0Y2goL18oXFxkKylfKFxcZCspLykubWFwKE51bWJlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb29yZGluYXRlcyA9IHBsYXllcjEuZ2V0UGxhY2VtZW50Q29vcmRzKFt4LHldLCBnZXREaXJlY3Rpb24oKSwgZ2V0U2hpcCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlzVmFsaWRQbGFjZW1lbnQgPSBwbGF5ZXIxLmNoZWNrUGxhY2VtZW50KFt4LHldLCBnZXREaXJlY3Rpb24oKSwgZ2V0U2hpcCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmlldy5jb2xvclBsYWNlbWVudChjb29yZGluYXRlcywgaXNWYWxpZFBsYWNlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZ2V0U2hpcCgpICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgWywgeCwgeV0gPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3Jkc1wiKS5tYXRjaCgvXyhcXGQrKV8oXFxkKykvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gcGxheWVyMS5nZXRQbGFjZW1lbnRDb29yZHMoW3gseV0sIGdldERpcmVjdGlvbigpLCBnZXRTaGlwKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWaWV3LnVuY29sb3JQbGFjZW1lbnQoY29vcmRpbmF0ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihnZXRTaGlwKCkgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGdldFNoaXAoKSArIFwiIFwiICsgZ2V0RGlyZWN0aW9uKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgWywgeCwgeV0gPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3Jkc1wiKS5tYXRjaCgvXyhcXGQrKV8oXFxkKykvKS5tYXAoTnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gcGxheWVyMS5nZXRQbGFjZW1lbnRDb29yZHMoW3gseV0sIGdldERpcmVjdGlvbigpLCBnZXRTaGlwKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZFBsYWNlbWVudCA9IHBsYXllcjEuY2hlY2tQbGFjZW1lbnQoW3gseV0sIGdldERpcmVjdGlvbigpLCBnZXRTaGlwKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGVmdENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sZWZ0Q2VsbHNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubGVmdFNoaXBzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc1ZhbGlkUGxhY2VtZW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjEucGxhY2VTaGlwKFt4LHldLCBnZXREaXJlY3Rpb24oKSwgZ2V0U2hpcCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbGxTaGlwc1BsYWNlZCA9IHBsYXllcjEuYXJlU2hpcHNPbkJvYXJkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWaWV3LnBsYWNlUGxheWVyU2hpcChsZWZ0Q2VsbHMsIHBsYXllclNoaXBzLCBjb29yZGluYXRlcywgZ2V0RGlyZWN0aW9uKCksIGdldFNoaXAoKSwgYWxsU2hpcHNQbGFjZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2hpcChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHJpZ2h0R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlnaHRHcmlkXCIpO1xyXG4gICAgICAgIHJpZ2h0R3JpZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgbGV0IHJpZ2h0Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJpZ2h0Q2VsbHNcIik7XHJcbiAgICAgICAgICAgIHJpZ2h0Q2VsbHMuZm9yRWFjaChjZWxsID0+e1xyXG4gICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihnYW1lU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWaWV3LmhvdmVyUmlnaHRDZWxsKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICBWaWV3LnVuaG92ZXJSaWdodENlbGwoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXllck1vdmUpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IHJlc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRHYW1lXCIpO1xyXG4gICAgICAgIHJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc3RhcnRHYW1lKVxyXG5cclxuICAgICAgICBsZXQgbWFpbk1lbnVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5NZW51XCIpO1xyXG4gICAgICAgIG1haW5NZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAgZW5kR2FtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJue2luaXQsIGdldENoYXJhY3RlciwgZ2V0RGlyZWN0aW9uLCBzZXREaXJlY3Rpb24sIHNldFNoaXAsIGdldFNoaXB9O1xyXG59KSgpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHVubXV0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdW5tdXRlXCIpO1xyXG4gICAgdW5tdXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3LnRvZ2dsZU1lbnVNdXNpYyk7XHJcbiAgICBWaWV3LnNob3dBdWRpb01vZGFsKCk7XHJcbiAgICBDb250cm9sbGVyLmluaXQoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==