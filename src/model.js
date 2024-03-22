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