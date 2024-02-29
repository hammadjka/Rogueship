function Ship(length){
    let sunk = false;
    let totalHits = 0;

    const hit = ()=>{
        if(!sunk){
            totalHits++;

            if(totalHits === length){
                sunk = true;
            }
        }
        return totalHits;
    }

    const isSunk = ()=>{
        return sunk;
    }

    const getLength = ()=>{
        return length;
    }
    
    return {getLength, hit, isSunk};
}

function Gameboard(){
    let gameBoard = [];
    const rangeMax = 10;
    const rangeMin = 0;

    const initBoard = ()=>{    
        for (let i = 0; i < 10; i++) {
            gameBoard[i] = [];
            for (let j = 0; j < 10; j++) {
                gameBoard[i][j] = 0;
            }
        }
    }
    initBoard();
    
    const boundCheck = (coord)=>{
        if(coord[0] < rangeMin || coord[0] > rangeMax){
            return false;
        }
        return true;
    }
    const isSpaceEmpty = (direction, startCoord, endCoord)=>{

    }

    //checks if start and end coordinates define a straight horizontal line the size of ship length
    const isValidHorizontal = (startCoord, endCoord, shipLength) => {
        return startCoord[1] == endCoord[1] && Math.abs(endCoord[0] - startCoord[0] + 1) == shipLength;
    }

    //checks if start and end coordinates define a straight vertical line the size of ship length
    const isValidVertical = (startCoord, endCoord, shipLength) => {
        return startCoord[0] == endCoord[0] && Math.abs(endCoord[1] - startCoord[1] + 1) == shipLength;
    }

    const isPlacementValid = (startCoord, endCoord, direction, ship)=>{
        if(!boundCheck(startCoord) || !boundCheck(endCoord)){
            return false;
        }
        if(direction == "horizontal"){
            return isSpaceEmpty(direction, startCoord, endCoord) && isValidHorizontal(startCoord, endCoord, ship.getLength());
        }else if(direction == "vertical"){
            return isSpaceEmpty(direction, startCoord, endCoord) && isValidVertical(startCoord, endCoord, ship.getLength());
        }
        
        return false;
    }
    const placeShip = (startCoord, endCoord, direction, ship)=>{
        if(isPlacementValid(startCoord, endCoord, direction, ship)){
            if(direction == "horizontal"){
                for(let i=0; i<ship.getLength(); i++){

                }
            }
        }
    }
    return {placeShip};
}
module.exports = {Ship, Gameboard};