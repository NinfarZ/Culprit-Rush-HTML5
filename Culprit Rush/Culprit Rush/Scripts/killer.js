import Character from "./character.js";


export default class Killer extends Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport, weapon) {
        super(charName, isAlive, gender, location, inventory, investigationReport);
        this.weapon = weapon;
    }
}
