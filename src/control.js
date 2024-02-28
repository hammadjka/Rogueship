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

}
module.exports = {Ship, Gameboard};