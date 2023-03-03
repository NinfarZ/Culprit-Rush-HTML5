import Character from "./character.js";
import { onCharKilled, characterList, player } from "./gameManager.js";
import { removeWeapon } from "./location.js";
import { dayManager } from "./dayManager.js";
import { seenWeapon, weaponMissing, alibi, seenCharAdjecentRoom } from "./uiOrganizer.js";
import { caseDetails } from "./gameManager.js";
import { textQueue } from "./uiData.js";

let weaponWitness = null;
let weaponLocation = null;
export default class Killer extends Character {
    constructor(charName, isAlive, gender, location, weapon, target) {
        super(charName, isAlive, gender, location);
        this.weapon = weapon;
        this.target = target;
        this.hasKilled = false;
    }
    findWeapon(roomDetails) {
        if (this.weapon) return;
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
        const investigationChance = 30;


        if (this.location.itemsInside[0]) {
            if (Math.floor(Math.random() * 100) <= investigationChance) {
                this.investigationReport[this.location.itemsInside[0].weaponName] = seenWeapon(this.charName, this.location.itemsInside[0].weaponName, this.location.name, dayManager.currentDay, dayManager.getTimeLie());
                weaponWitness = this.location.itemsInside[0].weaponName;
                weaponLocation = this.location;
            }

            if (!this.weapon) this.weapon = this.findWeapon(this.location.itemsInside);
        } else {
            if (weaponWitness in this.investigationReport && this.location === weaponLocation)
                if (Math.floor(Math.random() * 100) <= investigationChance)
                    this.investigationReport[weaponWitness] = weaponMissing(this.charName, weaponWitness, this.location.name, dayManager.currentDay, dayManager.getTimeLie());
        }

    }

    isAnyoneDead(room) {
        for (const char of room.whosInside) {
            if (!char.isAlive) return true;
        }
        return false;
    }

    getAdjacentVictimRooms(crimeScene) {
        const adjacentRooms = (room) => room.adjacentRooms.filter(adjRoom => adjRoom && this.isRoomValid(adjRoom) & !this.isAnyoneDead(adjRoom) && adjRoom.isOpen);
        const rooms = crimeScene.length === 2 ? adjacentRooms(crimeScene[0]).concat(adjacentRooms(crimeScene[1])) : adjacentRooms(crimeScene[0]);
        return rooms;
    }

    lie() {

        let investigationChance = 100;
        let charsUsedToLie = null;


        let possibleRoomsToLie = Object.values(this.location.adjecentRooms).filter(room => room && this.isRoomValid(room) && !this.isAnyoneDead(room) && room.isOpen);
        if (!possibleRoomsToLie.length) {
            possibleRoomsToLie = this.getAdjacentVictimRooms(caseDetails["crimeScene"]);
        }

        const roomIndex = Math.floor(Math.random() * possibleRoomsToLie.length);
        const randomAdjecentRoom = possibleRoomsToLie[roomIndex];
        if (Math.floor(Math.random() * 100) <= investigationChance) {
            if (randomAdjecentRoom.whosInside.length >= 1) {
                this.investigationReport[dayManager.getTime()] = alibi(this.charName, randomAdjecentRoom.name, randomAdjecentRoom.whosInside, dayManager.getTime());
                charsUsedToLie = randomAdjecentRoom.whosInside;
            }
            else this.investigationReport[dayManager.getTime()] = alibiSolo(this.charName, randomAdjecentRoom.name, dayManager.getTime());
            investigationChance -= 50;
        }

        if (Math.floor(Math.random() * 100) <= investigationChance) {
            this.investigateAdjecentRooms(this.location, possibleRoomsToLie, charsUsedToLie);
            investigationChance -= 10;
        }
    }

    investigateAdjecentRooms(room, possibleRoomsToLie, charsUsedToLie) {
        const whosInsideLie = this.location.whosInside.filter(char => char !== this);
        if (!whosInsideLie.length) return;
        if (!possibleRoomsToLie.length) return;
        let charToFrame = null;
        for (const room of possibleRoomsToLie) {
            if (charToFrame) continue;
            const roomNoPlayer = room.whosInside.filter(char => char !== player && !charsUsedToLie.includes(char));
            if (roomNoPlayer.length) {
                charToFrame = roomNoPlayer[0];
            }



        }
        if (charToFrame) {
            whosInsideLie.push(charToFrame);
            this.investigationReport[room.name] = seenCharAdjecentRoom(this.charName, whosInsideLie, this.location.name, dayManager.getTime());
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

    isPlayerAway(char) {
        if (char.location !== player.location && this.location !== player.location) return true;
        return false;
    }

    isCharWitness(char) {
        return char.location === this.location ? true : false;
    }

    isKillerAlone() {
        return this.location.whosInside.length > 1 ? false : true;
    }

    lookForTarget(characterList) {
        const possibleTargets = [...characterList];
        possibleTargets.splice(possibleTargets.indexOf(this), 1);
        this.target = possibleTargets.splice(Math.floor(Math.random() * possibleTargets.length), 1)[0];

    }

    turn() {
        if (!this.isAlive) return;
        if (!this.hasKilled) {
            if (Math.floor(Math.random() * 100) < 50) return;
        }
        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);

        if (!possibleRooms.length) return;

        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);

    }

    searchForKill() {

        if (this.hasKilled) return;
        if (!this.hasKillMood()) return;


        let victimList = [];
        const suicideChance = 10;
        if (this.isKillerAlone()) {
            if (Math.floor(Math.random() * 100) <= suicideChance) {

                this.weapon.kill(this);
                victimList.push(this);
                this.hasKilled = true
                onCharKilled(victimList)
                return;
            }
        }

        const possibleTargets = characterList.filter(char => char !== this && this.weapon.canKill(this, char) && this.isCharWitness);
        console.log(`possible target list is ${possibleTargets}`);

        for (const char of possibleTargets) {
            if (victimList.length < 2) {
                if (this.isPlayerAway(char)) {
                    this.weapon.kill(char);
                    victimList.push(char);
                    this.hasKilled = true
                }
            }
        }

        if (this.hasKilled) onCharKilled(victimList);
        console.log(`victim list is ${victimList}`);
    }
}
