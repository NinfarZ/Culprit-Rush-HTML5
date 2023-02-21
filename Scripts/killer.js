import Character from "./character.js";
import { onCharKilled, characterList } from "./gameManager.js";
import { removeWeapon } from "./location.js";
import { dayManager } from "./dayManager.js";
import { seenWeapon, alibi, seenCharAdjecentRoom } from "./uiOrganizer.js";
import { caseDetails } from "./gameManager.js";


export default class Killer extends Character {
    constructor(charName, isAlive, gender, location, weapon, target) {
        super(charName, isAlive, gender, location);
        this.weapon = weapon;
        this.target = target;
        this.hasKilled = false;
    }
    findWeapon(roomDetails) {
        if (this.weapon) return;
        if (this.location.whosInside > 1) return;
        const pickWeaponChance = 50;
        if (Math.floor(Math.random() * 100) > pickWeaponChance) return;

        for (const item of roomDetails) {

            if (item.itemType === "weapon") {
                removeWeapon(this.location, item);
                return item;
            }


        }
    }

    startMood() {
        this.moodLevel = 0.5;
    }

    moodSwing(multiplier) {

        //the killer gets 20% more angry and 50% less happy than others
        multiplier < 0 ? multiplier * 1.2 : multiplier * 0.5;
        this.moodLevel += Math.fround(multiplier);
        this.moodLevel = Math.min(1, Math.max(0, this.moodLevel));
        console.log(this.moodLevel);

    }

    investigate() {
        const whosInsideRoom = [...this.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(this), 1);

        if (this.location.itemsInside[0]) {
            //if (Math.floor(Math.random() * 100) <= investigationChance) 
            this.investigationReport[this.location.itemsInside[0].weaponName] = seenWeapon(this.charName, this.location.itemsInside[0].weaponName, this.location.name, dayManager.getTime());
            this.weapon = this.findWeapon(this.location.itemsInside);
        }
        if (whosInsideRoom.length > 1) {
            //if (Math.floor(Math.random() * 100) <= investigationChance) {
            this.investigationReport[dayManager.getTime()] = alibi(this.charName, this.location.name, whosInsideRoom, dayManager.getTime());
            //}
        }
        for (const room of Object.values(this.location.adjecentRooms)) {
            if (!room || !room.isOpen) continue;
            if (!this.isRoomValid(room)) continue;
            //if (Math.floor(Math.random() * 100) <= investigationChance)
            this.investigateAdjecentRooms(room);
        }
    }

    canSetTarget(averageMood) {
        const chanceOfTargetting = Math.fround(averageMood) * 100;

        return Math.floor(Math.random() * 100) >= chanceOfTargetting;

    }

    //killer only gets a chance of killing when angry
    hasKillMood() {
        if (this.moodLevel > 0.3) return false;
        return true;
    }

    isTargetAlone(target) {
        if (this.location === target.location) {
            if (target.location.whosInside.length === 2) return true;
            return false;
        }

        if (target.location.whosInside.length === 1) return true;
        return false;
    }

    lookForTarget(characterList) {
        const possibleTargets = [...characterList];
        possibleTargets.splice(possibleTargets.indexOf(this), 1);
        this.target = possibleTargets.splice(Math.floor(Math.random() * possibleTargets.length), 1)[0];

    }

    turn() {
        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);

        if (!possibleRooms.length) return;

        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);


        if (this.hasKilled) return;
        if (this.weapon) this.searchForKill();

    }

    searchForKill() {

        if (!this.hasKillMood()) return;
        for (const char of characterList) {
            if (!this.isTargetAlone(char)) return;
            if (this.weapon.canKill(this, char)) {
                this.weapon.kill(char);
                this.hasKilled = true;
                onCharKilled(char);
                return;
            }
        }

    }
}
