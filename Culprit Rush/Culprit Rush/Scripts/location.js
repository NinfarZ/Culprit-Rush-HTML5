import { weapons } from "./weapons.js";

export let locations = {
    MyBedroom: {
        name: "My Bedroom",
        isOpen: false,
        itemsInside: ["Bed", "Wardrobe"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": locations.Corridor,
                "back": null,
                "left": null,
                "right": null
            };
        }
    },
    Corridor: {
        name: "Corridor",
        isOpen: true,
        itemsInside: ["Plants", "Shelf"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": locations.Classroom,
                "back": locations.MyBedroom,
                "left": locations.Cafeteria,
                "right": locations.Corridor2
            };
        }
    },
    Corridor2: {
        name: "Corridor 2",
        isOpen: true,
        itemsInside: ["Plants", "Shelf"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": locations.BathroomF,
                "back": locations.BathroomM,
                "left": locations.Corridor,
                "right": locations.Pub
            }
        }
    },
    Classroom: {
        name: "Classroom",
        isOpen: true,
        itemsInside: ["Desks", "Chairs", "Blackboard"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": null,
                "back": locations.Corridor,
                "left": null,
                "right": null
            }
        }
    },
    Cafeteria: {
        name: "Cafeteria",
        isOpen: true,
        itemsInside: ["Large Table", "Pants"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": locations.TrashRoom,
                "back": null,
                "left": locations.Kitchen,
                "right": locations.Corridor
            }
        }
    },
    Kitchen: {
        name: "Kitchen",
        isOpen: true,
        itemsInside: ["Oven", "Sink", "Drawers"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": null,
                "back": null,
                "left": null,
                "right": locations.Cafeteria
            }
        }
    },
    TrashRoom: {
        name: "Trash Room",
        isOpen: false,
        itemsInside: ["Incinerator"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": null,
                "back": locations.Cafeteria,
                "left": null,
                "right": null
            }
        }
    },
    BathroomM: {
        name: "Bathroom M",
        isOpen: true,
        itemsInside: ["Sink", "Urinols", "Stalls"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": locations.Corridor2,
                "back": null,
                "left": null,
                "right": null
            }
        }
    },
    BathroomF: {
        name: "Bathroom F",
        isOpen: true,
        itemsInside: ["Sink", "Stalls"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": null,
                "back": locations.Corridor2,
                "left": null,
                "right": null
            }
        }
    },
    Pub: {
        name: "Pub",
        isOpen: true,
        itemsInside: ["Counter", "Couch"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": locations.ControlRoom,
                "back": null,
                "left": locations.Corridor2,
                "right": null
            }
        }
    },
    ControlRoom: {
        name: "Control Room",
        isOpen: false,
        itemsInside: ["Control Panel", "Breaker"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                "forward": null,
                "back": locations.Pub,
                "left": null,
                "right": null
            }
        }
    }
}


export function Location(locationName, status, objectList, charactersInside) {
    this.name = locationName;
    this.status = status;
    this.objectList = objectList;
    this.charactersInside = charactersInside;
}

export function hideWeapons() {
    const locationList = Object.values(locations)
    locationList.splice(locationList.indexOf(locations.ControlRoom), 1);
    locationList.splice(locationList.indexOf(locations.MyBedroom), 1);

    for (const weapon of weapons) {
        const randomLocation = locationList[Math.floor(Math.random() * locationList.length)];
        randomLocation.itemsInside.push(weapon);
        locationList.splice(locationList.indexOf(randomLocation), 1);

        console.log(`${weapon} was placed in the ${randomLocation.name}`);

    }
}