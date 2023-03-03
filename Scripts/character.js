import { locations } from "./location.js";
import { dayManager } from "./dayManager.js";
import { seenWeapon, weaponMissing, alibi, alibiSolo, seenCharAdjecentRoom } from "./uiOrganizer.js";
import { caseDetails, player } from "./gameManager.js";
import { textQueue } from "./uiData.js";

let weaponWitness = null;
let weaponLocation = null;

export default class Character {
    constructor(charName, isAlive, gender, location) {
        this.charName = charName;
        this.isAlive = isAlive;
        this.gender = gender;
        this.location = location;
        this.investigationReport = {};
        this.moodLevel = 0;
    }

    updateLocation(newLocation, oldLocation) {
        this.location = newLocation;
        let charsInOldLocation = oldLocation.whosInside;
        charsInOldLocation.splice(charsInOldLocation.indexOf(this), 1);
        if (newLocation.whosInside.includes(this)) {
            return;
        }
        newLocation.whosInside.push(this);

    }

    startMood() {
        //random mood level between 0.3 and 0.7
        this.moodLevel = Math.fround(Math.random() * (1 - 0.5) + 0.5);
    }

    moodSwing(multiplier) {
        this.moodLevel += Math.fround(multiplier);
        this.moodLevel = Math.min(1, Math.max(0, this.moodLevel));
        console.log(this.moodLevel);

    }

    getCharMood() {

        if (this.moodLevel >= 0.7) return "friendly";

        if (this.moodLevel <= 0.3) return "angry";

        return "casual";
    }


    investigate() {

        const whosInsideRoom = this.location.whosInside.filter(char => char !== this);
        let investigationChance = 100;


        if (Math.floor(Math.random() * 100) <= investigationChance) {
            if (whosInsideRoom.length >= 1) this.investigationReport[dayManager.getTime()] = alibi(this.charName, this.location.name, whosInsideRoom, dayManager.getTime());
            else this.investigationReport[dayManager.getTime()] = alibiSolo(this.charName, this.location.name, dayManager.getTime());
            console.log(`${this.charName}'s alibi is: `, this.investigationReport[dayManager.getTime()]);
            investigationChance -= 50;
        }

        if (this.location.itemsInside[0]) {
            if (Math.floor(Math.random() * 100) <= investigationChance) {
                this.investigationReport[this.location.itemsInside[0].weaponName] = seenWeapon(this.charName, this.location.itemsInside[0].weaponName, this.location.name, dayManager.currentDay, dayManager.getTime());
                weaponWitness = this.location.itemsInside[0].weaponName;
                weaponLocation = this.location;
                investigationChance -= 20;
            }
        } else {
            if (weaponWitness in this.investigationReport && this.location === weaponLocation)
                if (Math.floor(Math.random() * 100) <= investigationChance)
                    this.investigationReport[weaponWitness] = weaponMissing(this.charName, weaponWitness, this.location.name, dayManager.currentDay, dayManager.getTime());
        }

        for (const room of Object.values(this.location.adjecentRooms)) {
            if (!room || !room.isOpen) continue;
            if (!this.isRoomValid(room)) continue;
            if (Math.floor(Math.random() * 100) <= investigationChance)
                this.investigateAdjecentRooms(room);

        }

    }

    //character will testify with what they know about the case from their investigation report
    testify() {
        if (!this.isAlive) return;

        let hasNoInfo = true;
        const victims = caseDetails["victim"];
        const crimeLocations = caseDetails["crimeScene"].map(location => location.name);
        const timeOfDeath = caseDetails["timeOfDeath"];
        const murderWeapon = caseDetails["murderWeapon"].weaponName;

        if (timeOfDeath in this.investigationReport) {
            const time = this.investigationReport[timeOfDeath].slice();

            textQueue.pushIntoQueue(time);
            hasNoInfo = false;

        }

        for (const location of crimeLocations) {
            if (location in this.investigationReport) {
                const crimeScene = this.investigationReport[location].slice();

                textQueue.pushIntoQueue(crimeScene);
                hasNoInfo = false;

            }
        }


        if (murderWeapon in this.investigationReport) {
            const weapon = this.investigationReport[murderWeapon].slice();

            textQueue.pushIntoQueue(weapon);
            hasNoInfo = false;


        }


        if (hasNoInfo) textQueue.pushIntoQueue([`${this.charName}: I saw nothing.`]);


    }

    investigateAdjecentRooms(room) {
        this.investigationReport[room.name] = seenCharAdjecentRoom(this.charName, room.whosInside, room.name, dayManager.getTime());


    }

    isRoomValid(room) {
        if (!room.whosInside.length) return false
        if (room.whosInside.length === 1 && room.whosInside[0].charName === "you") return false;
        return true
    }


    randomizeLocation() {
        const possibleLocations = this.getPossibleLocations(locations);
        this.location = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
        console.log(this.location);
    }

    getPossibleLocations(locations) {
        const whosInside = (location) => location.whosInside.filter(char => char !== player);
        const ignoreBathroom = this.gender === "M" ? "Bathroom F" : "Bathroom M";
        return Object.values(locations).filter(location => location && location.isOpen && location.name !== ignoreBathroom && whosInside(location).length <= 1);
        // const possibleLocations = [];
        // const ignoreBathroom = this.gender === "M" ? "Bathroom F" : "Bathroom M";
        // for (const location of Object.values(locations)) {

        //     if (!location) continue;
        //     if (!location.isOpen) continue;
        //     if (location.name === ignoreBathroom) continue;

        //     const whosInside = location.whosInside.filter(char => char !== player);

        //     if (whosInside.length > 1) continue
        //     possibleLocations.push(location);
        // }
        // return possibleLocations;
    }

    turn() {
        if (!this.isAlive) return;
        if (Math.floor(Math.random() * 100) < 50) return;

        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);

        if (!possibleRooms.length) return;
        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);




    }
}



