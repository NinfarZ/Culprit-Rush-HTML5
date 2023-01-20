import Character from "./character.js";

export default class Player extends Character {
    constructor(charName, isAlive, gender, location, inventory) {
        super(charName, isAlive, gender, location, inventory);
    }
}
