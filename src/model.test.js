const {Ship, Gameboard} = require('./model');

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = Ship(3, 1);
    });
    test('getLength() should return the length of the ship', () => {
        expect(ship.getLength()).toBe(3);
        expect(ship.getWidth().toBe(1));
    });
    test('hit() should increment totalHits by 1', () => {
        expect(ship.hit()).toBe(1);
        expect(ship.hit()).toBe(2);
    });
    test('isSunk() should return true ONLY when totalHits equals length * width', () => {
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
    test('hit() should not increment totalHits once the ship has been sunk', () => {
        expect(ship.hit()).toBe(1);
        expect(ship.hit()).toBe(2);
        expect(ship.hit()).toBe(3);
        expect(ship.hit()).toBe(3);
    });
});

describe('Gameboard > placeShip()', ()=>{
    let gameBoard;

    beforeEach(()=>{
        gameBoard = Gameboard(0,9);
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
        gameBoard = Gameboard(0,9);
        expect(gameBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(gameBoard.placeShip([5,8], "horizontal", "Battleship")).toBe(true);
        expect(gameBoard.placeShip([2,7], "vertical", "Submarine")).toBe(true);
        expect(gameBoard.placeShip([7,2], "horizontal", "Cruiser")).toBe(true);
        expect(gameBoard.placeShip([4,5], "horizontal", "Destroyer")).toBe(true);
    })
    test("should return undefined if any of the ships are undeployed", ()=>{
        emptyBoard = Gameboard(0,9);
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
        expect(gameBoard.receiveAttack([3,2])).toBe(false);
    });
    test("should return undefined if an attack is repeated", ()=>{
        expect(gameBoard.receiveAttack([2,2])).toBe(true);
        expect(gameBoard.receiveAttack([2,2])).toBe(undefined);
        expect(gameBoard.receiveAttack([3,2])).toBe(false);
        expect(gameBoard.receiveAttack([3,2])).toBe(undefined);
    });
})