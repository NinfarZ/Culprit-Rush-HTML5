export default class Character {
    constructor(charName, isAlive, gender, location, inventory) {
        this.charName = charName;
        this.isAlive = isAlive;
        this.gender = gender;
        this.location = location;
        this.inventory = inventory;
    }

    set charLocation(location) {
        this.location = location;
        console.log(`${this.charName} is currently at ${location.name}. There are ${locations[location.name].whosInside.length} people there right now.`);

    }

    moveToPosition(direction) {
        let oldPosition = this.location;
        let newPosition = null;
        let positionIndex = map.locationList.indexOf(this.location);
        if (positionIndex === 0 && direction === "right" || positionIndex === 8 && direction === "left") {
            return;
        }

        switch (direction) {
            case "left":
                positionIndex += 1;
                newPosition = map.locationList[positionIndex];
                break;
            case "right":
                positionIndex -= 1;
                newPosition = map.locationList[positionIndex];
                break;
        }
        this.updateLocation(newPosition, oldPosition);
    }

    updateLocation(newPosition, oldPosition) {
        this.location = newPosition;
        let charsInOldPosisiton = oldPosition.whosInside;
        charsInOldPosisiton.splice(charsInOldPosisiton.indexOf(this), 1);
        if (newPosition.whosInside.includes(this)) {
            return;
        }
        newPosition.whosInside.push(this);

    }
}

const john = new Character("John", true, "M", null, []);
const jeff = new Character("Jeff", true, "M", null, []);
const maria = new Character("Maria", true, "F", null, []);
const sarah = new Character("Sarah", true, "F", null, []);
const james = new Character("James", true, "M", null, []);

export let characterList = [john, jeff, maria, sarah, james];
