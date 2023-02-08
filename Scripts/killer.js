import Character from "./character.js";
import { onCharKilled } from "./gameManager.js";
import { removeWeapon } from "./location.js";


export default class Killer extends Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport, moodLevel, weapon, target) {
        super(charName, isAlive, gender, location, inventory, investigationReport, moodLevel);
        this.weapon = weapon;
        this.target = target;
        this.hasKilled = false;
    }
    findWeapon(roomDetails) {
        if (this.weapon) return;
        if (this.location.whosInside > 1) return;
        const pickWeaponChance = 50;
        if (Math.floor(Math.random() * 100) > pickWeaponChance) return;

        for (const item of roomDetails[this.location.name]) {

            if (item.itemType === "weapon") return item;

        }
    }

    startMood() {
        this.moodLevel = 0.5;
    }

    moodSwing(multiplier) {

        //the killer gets 50% more angry and 50% less happy than others
        multiplier < 0 ? multiplier * 1.5 : multiplier * 0.5;
        this.moodLevel += Math.fround(multiplier);
        this.moodLevel = Math.min(1, Math.max(0, this.moodLevel));
        console.log(this.moodLevel);

    }

    //killer will lie in their investigation
    investigate() {
        const investigationChance = 50;
        if (Math.floor(Math.random() * 100) <= investigationChance) {
            if (this.location.itemsInside) {
                const roomDetails = { [this.location.name]: this.location.itemsInside };
                !this.investigationReport.includes(roomDetails) && this.investigationReport.push(roomDetails);
                this.weapon = this.findWeapon(roomDetails);

            }
        }
    }

    canSetTarget(averageMood) {
        const chanceOfTargetting = Math.fround(averageMood) * 100;

        return Math.floor(Math.random() * 100) >= chanceOfTargetting;

    }

    //killer only gets a chance of killing when angry
    canKillTarget() {
        if (this.moodLevel > 0.3) return;
        const chanceOfKilling = 50 * (1 - this.moodLevel);
        return Math.floor(Math.random() * 100) <= chanceOfKilling;
    }

    lookForTarget(characterList) {
        const possibleTargets = [...characterList];
        possibleTargets.splice(possibleTargets.indexOf(this), 1);
        this.target = possibleTargets.splice(Math.floor(Math.random() * possibleTargets.length), 1)[0];

    }

    turn() {
        if (!this.target) {
            const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);
            const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

            this.updateLocation(pickRoom, this.location);
            this.investigate();
            console.log(`${this.charName} is in the ${pickRoom.name}`);
        } else {
            if (this.hasKilled) return;
            this.searchForKill();
        }

    }

    searchForKill() {
        console.log(`killer has target ${this.target.charName}!!!!`);
        if (this.weapon.canKill(this, this.target) && this.canKillTarget()) {
            this.weapon.kill(this.target);
            this.hasKilled = true;
            onCharKilled(this.target);

            this.target = null;
            return;
        }
        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);
        for (const room of possibleRooms) {
            if (room.whosInside.includes(this.target)) this.updateLocation(room, this.location);

        }
    }
}
