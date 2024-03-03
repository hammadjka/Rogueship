function Ship(length){
    let totalHits = 0;

    const isSunk = ()=>{
        return totalHits === length
    }

    const hit = ()=>{
        if(!isSunk()){
            totalHits++;
        }
        return totalHits;
    }

    const getLength = ()=>{
        return length;
    }
    
    return {getLength, hit, isSunk};
}

function Gameboard(){
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    const rangeMax = 9;
    const rangeMin = 0;
    let Carrier = Ship(5);
    let Battleship = Ship(4);
    let Cruiser = Ship(3);
    let Submarine = Ship(3);
    let Destroyer = Ship(2);

    const Status = {"Undeployed": 0,
                    "Deployed": 1,
                    "Sunk": -1};

    const Ships = {"Carrier":[Carrier, Status.Undeployed], 
                   "Battleship":[Battleship, Status.Undeployed], 
                   "Cruiser":[Cruiser, Status.Undeployed], 
                   "Submarine":[Submarine, Status.Undeployed], 
                   "Destroyer":[Destroyer, Status.Undeployed]};

    let gameBoard = [];
    // 0 for empty space, 1 for space occupied by a ship.
    const initBoard = ()=>{    
        for (let i = 0; i < 10; i++) {
            gameBoard[i] = [];
            for (let j = 0; j < 10; j++) {
                gameBoard[i][j] = 0;
            }
        }
    }
    initBoard();

    const getCoordinates = (midCoord, direction, shipLength)=>{
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

    const boundCheck = (coord)=>{
        if(coord[0] < rangeMin || coord[0] > rangeMax || coord[1] < rangeMin || coord[1] > rangeMax){
            console.log("error, out of bounds");
            return false;
        }
        return true;
    }

    const isSpaceEmpty = (direction, startCoord, shipLength)=>{
        let x = startCoord[0];
        let y = startCoord[1];
        for(let i=0; i<shipLength; i++){
            if(gameBoard[y][x] == 1){
                console.log("error, collision detected")
                return false;
            }
            if(direction == Horizontal){
                x++;
            }else if(direction == Vertical){
                y++;
            }
        }
        return true;
    }

    const isPlacementValid = (startCoord, endCoord, direction, shipLength)=>{
        return(boundCheck(startCoord) && boundCheck(endCoord) && isSpaceEmpty(direction, startCoord, shipLength))
    }
    const isShipValid =(shipName)=>{
        let shipData = Ships[shipName];
        if(!shipData){
            console.log("error, incorrect ship name")
            return false;
        }
        if(shipData[1] !== Status.Undeployed){
            console.log("error, can not place an already deployed or sunk ship");
            return false;
        }
        return true;
    }

    const placeShip = (midCoord, direction, shipName)=>{
        if(!isShipValid(shipName)){
            return false;
        }
        let shipData = Ships[shipName];
        let ship = shipData[0];
        let shipLength = ship.getLength();
        const {startCoord, endCoord} = getCoordinates(midCoord, direction, shipLength);
        
        if(!isPlacementValid(startCoord, endCoord, direction, shipLength)){
            return false;
        }
        let x = startCoord[0];
        let y = startCoord[1];
        for(let i=0; i<shipLength; i++){
            gameBoard[y][x] = 1;
            if(direction == Horizontal){
                x++;
            }else if(direction == Vertical){
                y++;
            }
        }
        shipData[1] = Status.Deployed;
        return true;
    }

    const logBoard = ()=>{
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                process.stdout.write(gameBoard[i][j] + " ");
            }
            console.log();
        }
    }

    return {placeShip, logBoard};
}
module.exports = {Ship, Gameboard};
