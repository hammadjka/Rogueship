const {Ship, Gameboard} = require('./model');

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = Ship(3);
    });

    test('getLength() should return the length of the ship', () => {
        expect(ship.getLength()).toBe(3);
    });

    test('hit() should increment totalHits by 1', () => {
        expect(ship.hit()).toBe(1);
        expect(ship.hit()).toBe(2);
    });

    test('isSunk() should return true ONLY when totalHits equals length', () => {
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

describe('Gameboard', ()=>{
    let gameBoard;

    beforeEach(()=>{
        gameBoard = Gameboard();
    })

    test('placeShip() should not place a ship at invalid coodinates ', ()=>{
        expect(gameBoard.placeShip([-1,-1], "vertical", "Carrier")).toBe(false);
        expect(gameBoard.placeShip([1,0], "vertical", "Submarine")).toBe(false);
        expect(gameBoard.placeShip([-1,-1], "horizontal", "Carrier")).toBe(false);
        expect(gameBoard.placeShip([0,11], "horizontal", "Submarine")).toBe(false);
        
    });
    test("placeShip() should not place a ship if coordinates collide with another ship's position", ()=>{
        expect(gameBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(gameBoard.placeShip([2,3], "vertical", "Carrier")).toBe(false);
        expect(gameBoard.placeShip([2,6], "vertical", "Submarine")).toBe(true);
        expect(gameBoard.placeShip([3,5], "horizontal", "Carrier")).toBe(false);
    });
    test("placeShip() should not allow for more than one instance of a ship on the board", ()=>{
        expect(gameBoard.placeShip([2,2], "vertical", "Carrier")).toBe(true);
        expect(gameBoard.placeShip([2,7], "vertical", "Submarine")).toBe(true);
        expect(gameBoard.placeShip([1,2], "vertical", "Carrier")).toBe(false);
        expect(gameBoard.placeShip([1,7], "vertical", "Submarine")).toBe(false);
    });
})
