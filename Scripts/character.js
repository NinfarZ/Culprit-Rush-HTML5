import { locations } from "./location.js";
import { dayManager } from "./dayManager.js";
import { seenWeapon, alibi, seenCharAdjecentRoom } from "./uiOrganizer.js";
import { caseDetails, player } from "./gameManager.js";
import { textQueue } from "./uiData.js";

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


    investigate() {

        const whosInsideRoom = [...this.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(this), 1);

        if (this.location.itemsInside[0]) {
            //if (Math.floor(Math.random() * 100) <= investigationChance)
            this.investigationReport[this.location.itemsInside[0].weaponName] = seenWeapon(this.charName, this.location.itemsInside[0].weaponName, this.location.name, dayManager.getTime());

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
        console.log(this.investigationReport);
    }

    //character will testify with what they know about the case from their investigation report
    testify() {
        if (!this.isAlive) return;

        const victim = caseDetails["victim"];
        const crimeLocation = caseDetails["victim"].location.name;
        const timeOfDeath = caseDetails["timeOfDeath"];
        const murderWeapon = caseDetails["murderWeapon"].weaponName;

        if (timeOfDeath in this.investigationReport) textQueue.pushIntoQueue(this.investigationReport[timeOfDeath]);

        if (crimeLocation in this.investigationReport) textQueue.pushIntoQueue(this.investigationReport[crimeLocation]);

        if (murderWeapon in this.investigationReport) textQueue.pushIntoQueue(this.investigationReport[murderWeapon]);
        console.log(textQueue);

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
        const possibleLocations = [];
        const ignoreBathroom = this.gender === "M" ? "Bathroom F" : "Bathroom M";
        for (const location of Object.values(locations)) {

            if (!location) continue;
            if (location.name === ignoreBathroom) continue;

            const whosInside = [...location.whosInside];
            whosInside.splice(whosInside.indexOf(player), 1);

            if (whosInside.length > 1) continue
            if (location.isOpen) possibleLocations.push(location);
        }
        return possibleLocations;
    }

    turn() {
        if (!this.isAlive) return;

        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);

        if (!possibleRooms.length) return;
        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);

        console.log(`${this.charName} is in the ${pickRoom.name}`);

    }
}



