const {Ship, Gameboard} = require('./control');

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
