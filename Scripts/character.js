import { locations } from "./location.js";

export default class Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport) {
        this.charName = charName;
        this.isAlive = isAlive;
        this.gender = gender;
        this.location = location;
        this.inventory = inventory;
        this.investigationReport = investigationReport;
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

    getPossibleDirections() {
        const adjecentRooms = this.location.adjecentRooms;


        let possibleRooms = [];
        for (const location of Object.values(adjecentRooms)) {
            if (location === locations.BathroomF || location === locations.BathroomM) {
                if (location.name.includes(this.gender)) possibleRooms.push(location);
            } else {
                if (location && location.isOpen) possibleRooms.push(location);
            }
        }

        return possibleRooms;
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

    turn() {
        const possibleRooms = this.getPossibleDirections();
        const pickRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]

        this.updateLocation(pickRoom, this.location);
        this.investigate();
        console.log(`${this.charName} is in the ${pickRoom.name}`);

    }
}

