function Ship(length){
    let totalHits = 0;

    const isSunk = ()=>{
        return totalHits === length
    }
    
    const hit = ()=>{
        if(!isSunk){
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
            console.log("out of bounds");
            return false;
        }
        return true;
    }

    const isSpaceEmpty = (direction, startCoord, shipLength)=>{
        let x = startCoord[0];
        let y = startCoord[1];
        for(let i=0; i<shipLength; i++){
            if(gameBoard[y][x] == 1){
                console.log("collision detected")
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

    const placeShip = (midCoord, direction, ship)=>{
        let shipLength = ship.getLength();
        const {startCoord, endCoord} = getCoordinates(midCoord, direction, shipLength);
        console.log(startCoord + " " + endCoord)
        if(!isPlacementValid(startCoord, endCoord, direction, shipLength)){
            return;
        }
        console.log("correct placement");
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

//quick tests
// let gameBoard = Gameboard();
// let ship5 = Ship(5);
// let ship4 = Ship(4);
// let ship2 = Ship(2);
// gameBoard.placeShip([-1,-1], "vertical", ship5);
// gameBoard.placeShip([1,0], "vertical", ship5);
// gameBoard.placeShip([2,2], "vertical", ship5);
// gameBoard.placeShip([1,7], "vertical", ship4);

// gameBoard.placeShip([-1,-1], "horizontal", ship5);
// gameBoard.placeShip([1,0], "horizontal", ship5);
// gameBoard.placeShip([5,2], "horizontal", ship5);
// gameBoard.placeShip([3,7], "horizontal", ship4);

// gameBoard.placeShip([0,7], "horizontal", ship2);
// gameBoard.logBoard();
