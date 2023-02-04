import Character from "./character.js";
import { removeWeapon } from "./location.js";


export default class Killer extends Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport, weapon) {
        super(charName, isAlive, gender, location, inventory, investigationReport);
        this.weapon = weapon;
    }
    findWeapon(roomDetails) {
        if (this.weapon) return;
        if (this.location.whosInside > 1) return;
        const pickWeaponChance = 50;
        if (Math.floor(Math.random() * 100) <= pickWeaponChance) return;

        for (const item of roomDetails[this.location.name]) {

            if ("weapon" in item) return item;
            console.log(this.weapon);
        }
    }

    investigate() {
        const investigationChance = 30;
        if (Math.floor(Math.random() * 100) <= investigationChance) {
            if (this.location.itemsInside) {
                const roomDetails = { [this.location.name]: this.location.itemsInside };
                !this.investigationReport.includes(roomDetails) && this.investigationReport.push(roomDetails);
                this.weapon = this.findWeapon(roomDetails);
            }
        }
    }

    turn() {
        const possibleRooms = this.getPossibleDirections();
        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);
        this.investigate();
        console.log(`${this.charName} is in the ${pickRoom.name}`);
    }
}
