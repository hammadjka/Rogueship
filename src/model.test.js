const {Ship, Gameboard} = require('./model');

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = Ship(5, 2);
    });
    test('getLength() should return the length of the ship', () => {
        expect(ship.getLength()).toBe(5);
        expect(ship.getWidth()).toBe(2);
    });
    test('hit() should increment totalHits by 1', () => {
        expect(ship.hit()).toBe(1);
        expect(ship.hit()).toBe(2);
    });
    test('isSunk() should return true ONLY when totalHits equals length * width', () => {
        for(let i=0; i<ship.getWidth(); i++){
            for(let j=0; j<ship.getLength(); j++){
                expect(ship.isSunk()).toBe(false);
                ship.hit();
            }
        }
        expect(ship.isSunk()).toBe(true);
    });
    test('hit() should not increment totalHits once the ship has been sunk', () => {
        for(let i=0; i<ship.getWidth(); i++){
            for(let j=0; j<ship.getLength(); j++){
                expect(ship.isSunk()).toBe(false);
                ship.hit();
            }
        }
        expect(ship.hit()).toBe(10);
        ship.hit();
        expect(ship.hit()).toBe(10);
    });
});

describe('Gameboard > placeShip()', ()=>{
    let gameBoard;

    beforeEach(()=>{
        gameBoard = Gameboard();
    })
    test('should not place a ship at invalid coodinates ', ()=>{
        expect(gameBoard.placeShip([2,-1], "vertical", "Carrier")).toBe(false);
        expect(gameBoard.placeShip([0,0], "vertical", "Submarine")).toBe(false);
        expect(gameBoard.placeShip([-1,-1], "horizontal", "Destroyer")).toBe(false);
        expect(gameBoard.placeShip([0,11], "horizontal", "Battleship")).toBe(false);
        expect(gameBoard.placeShip([9,0], "horizontal", "Cruiser")).toBe(false);
    });
    test("should not place a ship if coordinates collide with another ship's position", ()=>{
        expect(gameBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(gameBoard.placeShip([2,3], "vertical", "Battleship")).toBe(false);
        expect(gameBoard.placeShip([2,7], "vertical", "Submarine")).toBe(true);
        expect(gameBoard.placeShip([3,7], "horizontal", "Cruiser")).toBe(false);
    });
    test("should not allow for more than one instance of a ship on the board", ()=>{
        expect(gameBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(gameBoard.placeShip([2,7], "vertical", "Submarine")).toBe(true);
        expect(gameBoard.placeShip([1,2], "vertical", "Carrier")).toBe(false);
        expect(gameBoard.placeShip([1,7], "vertical", "Submarine")).toBe(false);
    });
    test("should place ships with valid args", ()=>{
        expect(gameBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(gameBoard.placeShip([5,8], "horizontal", "Battleship")).toBe(true);
        expect(gameBoard.placeShip([2,7], "vertical", "Submarine")).toBe(true);
        expect(gameBoard.placeShip([7,2], "horizontal", "Cruiser")).toBe(true);
        expect(gameBoard.placeShip([4,5], "horizontal", "Destroyer")).toBe(true);
    });
})

describe('Gameboard > receiveAttack()', ()=>{
    beforeEach(()=>{
        gameBoard = Gameboard();
        gameBoard.placeShip([2,2], "vertical", "Carrier")
        gameBoard.placeShip([5,8], "horizontal", "Battleship")
        gameBoard.placeShip([2,7], "vertical", "Submarine")
        gameBoard.placeShip([7,2], "horizontal", "Cruiser")
        gameBoard.placeShip([4,5], "horizontal", "Destroyer")
    })
    test("should return undefined if any of the ships are undeployed", ()=>{
        emptyBoard = Gameboard();
        expect(emptyBoard.receiveAttack([2,2])).toBe(undefined);
        expect(emptyBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(emptyBoard.placeShip([5,8], "horizontal", "Battleship")).toBe(true);
        expect(emptyBoard.placeShip([2,7], "vertical", "Submarine")).toBe(true);
        expect(emptyBoard.placeShip([7,2], "horizontal", "Cruiser")).toBe(true);
        expect(emptyBoard.receiveAttack([2,2])).toBe(undefined);
    });
    test("should return undefined if out of bound coords are passed", ()=>{
        expect(gameBoard.receiveAttack([-2,2])).toBe(undefined);
    });
    test("should return true if coords hits a ship", ()=>{
        expect(gameBoard.receiveAttack([2,2])).toBe(true);
    });
    test("should return false if coords misses a ship", ()=>{
        expect(gameBoard.receiveAttack([4,2])).toBe(false);
    });
    test("should return undefined if an attack is repeated", ()=>{
        expect(gameBoard.receiveAttack([2,2])).toBe(true);
        expect(gameBoard.receiveAttack([2,2])).toBe(undefined);
        expect(gameBoard.receiveAttack([4,2])).toBe(false);
        expect(gameBoard.receiveAttack([4,2])).toBe(undefined);
    });
})

describe('Gameboard > getSunken()', ()=>{
    beforeEach(()=>{
        gameBoard = Gameboard();
        gameBoard.placeShip([2,2], "vertical", "Carrier")
        gameBoard.placeShip([5,8], "horizontal", "Battleship")
        gameBoard.placeShip([2,7], "vertical", "Submarine")
        gameBoard.placeShip([7,2], "horizontal", "Cruiser")
        gameBoard.placeShip([4,5], "horizontal", "Destroyer")
    })
    test("should return sunk ships name", ()=>{
        gameBoard.receiveAttack([4,5]);
        gameBoard.receiveAttack([5,5]);
        let sunkArray = gameBoard.getSunken()
        expect(sunkArray).toHaveLength(1);
        expect(sunkArray).toContain("Destroyer");
        gameBoard.receiveAttack([6,2]);
        gameBoard.receiveAttack([7,2]);
        gameBoard.receiveAttack([8,2]);
        sunkArray = gameBoard.getSunken();
        expect(sunkArray).toHaveLength(2);
        expect(sunkArray).toContain("Destroyer");
        expect(sunkArray).toContain("Cruiser");

    });
    test("should return empty array when no ships are sunk", ()=>{
        expect(gameBoard.getSunken()).toHaveLength(0)
    });
})