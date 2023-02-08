import { locations } from "./location.js";
import { dayManager } from "./dayManager.js";

export default class Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport, moodLevel) {
        this.charName = charName;
        this.isAlive = isAlive;
        this.gender = gender;
        this.location = location;
        this.inventory = inventory;
        this.investigationReport = investigationReport;
        this.moodLevel = moodLevel;
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
        this.moodLevel = Math.fround(Math.random() * (0.7 - 0.5) + 0.5);
    }

    moodSwing(multiplier) {
        this.moodLevel += Math.fround(multiplier);
        this.moodLevel = Math.min(1, Math.max(0, this.moodLevel));
        console.log(this.moodLevel);

    }


    investigate() {
        const investigationChance = 30;
        if (Math.floor(Math.random() * 100) <= investigationChance) {
            if (this.location.itemsInside) {
                const roomDetails = { [this.location.name]: this.location.itemsInside };
                !this.investigationReport.includes(roomDetails) && this.investigationReport.push(roomDetails);
            }
        }
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
            if (location.isOpen) possibleLocations.push(location);
        }
        return possibleLocations;
    }

    turn() {
        if (!this.isAlive) return;

        const chanceOfMoving = 50;
        if (Math.floor(Math.random() * 100) <= chanceOfMoving) return;

        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);
        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);
        this.investigate();
        console.log(`${this.charName} is in the ${pickRoom.name}`);

    }
}



