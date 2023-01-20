export let killer;

export default class Killer extends Character {
    constructor(charName, isAlive, gender, location, inventory, weapon) {
        super(charName, isAlive, gender, location, inventory);
        this.weapon = weapon;
    }
}
