function Ship(length, width){
    let totalHits = 0;

    const isSunk = ()=>{
        return totalHits === length * width;
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
    const getWidth = ()=>{
        return width;
    }
    
    return {getLength, getWidth, hit, isSunk};
}

function Gameboard(rangeMin, rangeMax){
    const Horizontal = "horizontal";
    const Vertical = "vertical";
    let carrier = Ship(5,2);
    let battleship = Ship(4,2);
    let cruiser = Ship(3,1);
    let submarine = Ship(3,1);
    let destroyer = Ship(2,1);

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

    const Ships = {"Carrier":{"ship": carrier, "status": Status.undeployed, "id": Cells.ca, "coordinates": []}, 
                   "Battleship":{"ship": battleship,"status":Status.undeployed, "id": Cells.ba, "coordinates": []}, 
                   "Cruiser":{"ship": cruiser, "status": Status.undeployed,  "id": Cells.cr}, "coordinates": [], 
                   "Submarine":{"ship": submarine, "status": Status.undeployed,  "id": Cells.su, "coordinates": []}, 
                   "Destroyer":{"ship": destroyer, "status": Status.undeployed, "id": Cells.de, "coordinates": []}
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
        const Ids = [Cells.ca, Cells.ba, Cells.cr, Cells.su, Cells.de];
        for(let i=0; i<shipLength; i++){
            if(Ids.includes(gameBoard[y][x])){
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

    const isPlacementValid = (midCoord, direction, shipLength)=>{
        const {startCoord, endCoord} = getCoordinates(midCoord, direction, shipLength);
        return(boundCheck(startCoord) && boundCheck(endCoord) && isSpaceEmpty(direction, startCoord, shipLength))
    }
    const isShipValid =(shipName)=>{
        let shipData = Ships[shipName];
        if(!shipData){
            console.log("error, incorrect ship name")
            return false;
        }
        if(shipData["status"] !== Status.undeployed){
            console.log("error, can not place an already deployed or sunk ship");
            return false;
        }
        return true;
    }

    const placeShip = (midCoord, direction, shipName)=>{
        if(!isShipValid(shipName)){
            return false;
        }
        let shipObj = Ships[shipName];
        let ship = shipObj.ship;
        let shipLength = ship.getLength();
        let shipwidth = ship.getWidth();
        let shipCoordinates = []; 
        if(!isPlacementValid(midCoord, direction, shipLength)){
            return false;
        }
        for(let i=0; i<shipwidth; i++){
            const {startCoord, endCoord} = getCoordinates(midCoord, direction, shipLength);
            let x = startCoord[0];
            let y = startCoord[1];
            for(let j=0; j<shipLength; j++){
                shipCoordinates.push([x,y]);
                direction === Horizontal ? x++ : y++;
            }
            direction === Horizontal ? midCoord[1]++ : midCoord[0]++;
        }
        shipObj.coordinates = shipCoordinates;
        shipCoordinates.forEach(coord => {
            const x = coord[0];
            const y = coord[1];
            updateBoard(x, y, shipObj.id);
        });
        shipObj.status = Status.deployed;
        return true;
    }
    const areShipsOnBoard = ()=>{
        let check = true;
        Object.keys(Ships).forEach(shipName => {
            if(Ships[shipName].status === Status.undeployed){
                check = false;
            }
        });
        if(!check){console.log("all ships are not deployed yet")}
        return check;
    }
    const areShipsSunk = ()=>{
        if(!areShipsOnBoard()){
            return false;
        }
        let check = true;
        Object.keys(Ships).forEach(shipName => {
            if(Ships[shipName].status !== Status.sunk){
                check = false;
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
            return (boundCheck(coord) && areShipsOnBoard())
        }
        return false;
    }
    const getShipById = (id)=>{
        let ship = undefined;
        Object.keys(Ships).forEach(shipName => {
            if(Ships[shipName].id == id){
                ship = Ships[shipName].ship;
            }
        });
        return ship;
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
            let ship = getShipById(gameBoard[y][x]);
            console.log(gameBoard[y][x])
            ship.hit();
            updateBoard(x,y,Cells.hit);
            return true;
        }

        //miss otherwise
        updateBoard(x,y,Cells.miss);
        return false;
    }

    const logBoard = ()=>{
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                process.stdout.write(gameBoard[i][j] + " ");
            }
            console.log();
        }
    }

    return {placeShip, receiveAttack, logBoard};
}

function Player(name, pBoard, oppBoard){
    const score = 0;
    const playerName = name;
    const enemyBoard = oppBoard;
    const playerBoard = pBoard;
} 
module.exports = {Ship, Gameboard};

let gameBoard = Gameboard();
gameBoard.placeShip([2,2], "vertical", "Carrier")
gameBoard.placeShip([5,8], "horizontal", "Battleship")
gameBoard.placeShip([2,7], "vertical", "Submarine")
gameBoard.placeShip([7,2], "horizontal", "Cruiser")
gameBoard.placeShip([4,5], "horizontal", "Destroyer")

gameBoard.logBoard();

// gameBoard.placeShip([9,0], "horizontal", "Cruiser")

// emptyBoard = Gameboard();
// console.log(emptyBoard.receiveAttack([2,2]));
