import { weapons } from "./weapons.js";


class Location {
    constructor(name, isOpen, furnitureInside, itemsInside, whosInside) {
        this.name = name;
        this.isOpen = isOpen;
        this.furnitureInside = furnitureInside;
        this.itemsInside = itemsInside;
        this.whosInside = whosInside;
        this.adjecentRooms = null;
    }

    pushAdjecentRooms(forwardLoc, backLoc, leftLoc, rightLoc) {
        this.adjecentRooms = { "forward": forwardLoc, "back": backLoc, "left": leftLoc, "right": rightLoc }
    }
}

const MyBedroom = new Location("My Bedroom", false, ["Bed", "Wardrobe"], [], []);

const Corridor = new Location("Corridor", true, ["Plants", "Shelf"], [], []);

const Corridor2 = new Location("Corridor 2", true, ["Plants", "Shelf"], [], []);

const Classroom = new Location("Classroom", true, ["Desks", "Chairs", "Blackboard"], [], []);

const Cafeteria = new Location("Cafeteria", true, ["Large Table", "Pants"], [], []);

const Kitchen = new Location("Kitchen", true, ["Oven", "Sink", "Drawers"], [], []);

const TrashRoom = new Location("Trash Room", false, ["Incinerator"], [], []);

const BathroomM = new Location("Bathroom M", true, ["Sink", "Urinols", "Stalls"], [], []);

const BathroomF = new Location("Bathroom F", true, ["Sink", "Stalls"], [], []);

const Pub = new Location("Pub", true, ["Counter", "Couch"], [], []);

const ControlRoom = new Location("Control Room", false, ["Control Panel", "Breaker"], [], []);

//forward, back, left, right
MyBedroom.pushAdjecentRooms(Corridor, null, null, null);
Corridor.pushAdjecentRooms(Classroom, MyBedroom, Cafeteria, Corridor2);
Corridor2.pushAdjecentRooms(BathroomF, BathroomM, Corridor, Pub);
Classroom.pushAdjecentRooms(null, Corridor, null, null);
Cafeteria.pushAdjecentRooms(TrashRoom, null, Kitchen, Corridor);
Kitchen.pushAdjecentRooms(null, null, null, Cafeteria);
TrashRoom.pushAdjecentRooms(null, Cafeteria, null, null);
BathroomM.pushAdjecentRooms(Corridor2, null, null, null);
BathroomF.pushAdjecentRooms(null, Corridor2, null, null);
Pub.pushAdjecentRooms(ControlRoom, null, Corridor2, null);
ControlRoom.pushAdjecentRooms(null, Pub, null, null);

export const locations = { MyBedroom, Corridor, Corridor2, Classroom, Cafeteria, Kitchen, TrashRoom, BathroomM, BathroomF, Pub, ControlRoom };





export function hideWeapons() {
    const locationList = Object.values(locations)
    locationList.splice(locationList.indexOf(locations.ControlRoom), 1);
    locationList.splice(locationList.indexOf(locations.MyBedroom), 1);

    for (const weapon of Object.values(weapons)) {
        const randomLocation = locationList[Math.floor(Math.random() * locationList.length)];
        randomLocation.itemsInside.push(weapon);
        locationList.splice(locationList.indexOf(randomLocation), 1);

        console.log(`${weapon.weaponName} was placed in the ${randomLocation.name}`);

    }
}

export function removeWeapon(location, weapon) {
    location.itemsInside.splice(location.itemsInside.indexOf(weapon));
}