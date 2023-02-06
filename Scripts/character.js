import { locations } from "./location.js";

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

    moodSwing(multiplier) {
        this.moodLevel += multiplier;
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
        const ignoreBathroom = this.gender === "M" ? locations.BathroomF : locations.BathroomM;
        for (const location of Object.values(locations)) {
            if (!location) continue;
            if (location === ignoreBathroom) continue;
            if (location.isOpen) possibleLocations.push(location);
        }
        return possibleLocations;
    }

    turn() {
        const chanceOfMoving = 50;
        if (Math.floor(Math.random() * 100) <= chanceOfMoving) return;

        const possibleRooms = this.getPossibleLocations(this.location.adjecentRooms);
        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);
        this.investigate();
        console.log(`${this.charName} is in the ${pickRoom.name}`);

    }
}



