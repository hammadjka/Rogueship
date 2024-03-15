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
    return {getLength, getWidth, getId, getStatus, setStatus, hit, isSunk};
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

    const Fleet = {"Carrier":{"ship": carrier, "coordinates": []}, 
                   "Battleship":{"ship": battleship, "coordinates": []}, 
                   "Cruiser":{"ship": cruiser, "coordinates": []}, 
                   "Submarine":{"ship": submarine, "coordinates": []}, 
                   "Destroyer":{"ship": destroyer, "coordinates": []}
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
        let ship = shipObj.ship;
        if(!isPlacementValid(midCoord, direction, shipName)){
            return false;
        }
        let shipCoordinates = getPlacement(midCoord, direction, shipName);
        shipObj.coordinates = shipCoordinates;
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
        if(!check){console.log("all ships are not deployed yet")}
        return check;
    }
    const shipsSunk = ()=>{
        if(!areShipsOnBoard()){
            return false;
        }
        let sunkCount = 0;
        Object.keys(Fleet).forEach(shipName => {
            if(Fleet[shipName].ship.getStatus() !== Status.sunk){
                sunkCount++;
            }
        });
        if(!check){console.log("all ships are not sunk yet")}
        return check;

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
            console.log(gameBoard[y][x])
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

    const logBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            let row = '';
            for (let j = 0; j < gameBoard[i].length; j++) {
                row += gameBoard[i][j] + " ";
            }
            console.log(row);
        }
    }

    return {getPlacement,
            isPlacementValid, 
            placeShip, 
            receiveAttack,
            getOutOfBoundCoords,
            logBoard};
}

function Player(){
    const score = 0;
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
        let result = board.receiveAttack(coords);
        if(result){updateScore()};
        return result;
    }
    const resetBoard = ()=>{
        board = Gameboard();
    }

    return{placeShip, getPlacementCoords, checkPlacement, receiveAttack, resetBoard};
} 
module.exports = {Ship, Gameboard, Player};

// let gameBoard = Gameboard();
// gameBoard.placeShip([2,2], "vertical", "Carrier")
// gameBoard.placeShip([5,8], "horizontal", "Battleship")
// gameBoard.placeShip([2,7], "vertical", "Submarine")
// gameBoard.placeShip([7,2], "horizontal", "Cruiser")
// gameBoard.placeShip([4,5], "horizontal", "Destroyer")

// gameBoard.logBoard();

// gameBoard.placeShip([9,0], "horizontal", "Cruiser")

// emptyBoard = Gameboard();
// console.log(emptyBoard.receiveAttack([2,2]));
