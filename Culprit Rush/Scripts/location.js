export let locations = {
    MyBedroom: {
        name: "My Bedroom",
        status: "CLOSED",
        itemsInside: ["Bed", "Wardrobe"],
        whosInside: [],
        adjecentRooms: function () {
            return { forward: this.Corridor, back: null, left: null, right: null };
        }
    },
    Corridor: {
        name: "Corridor",
        status: "OPEN",
        itemsInside: ["Plants", "Shelf"],
        whosInside: [],
        adjecentRooms: function () {
            return { forward: this.Classroom, back: this.MyBedroom, left: this.Cafeteria, right: this.Corridor2 };
        }
    },
    Corridor2: {
        name: "Corridor 2",
        status: "OPEN",
        itemsInside: ["Plants", "Shelf"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                forward: this.BathroomF,
                back: this.BathroomM,
                left: this.Corridor,
                right: this.Pub
            }
        }
    },
    Classroom: {
        name: "Classroom",
        status: "OPEN",
        itemsInside: ["Desks", "Chairs", "Blackboard"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                forward: null,
                back: this.Corridor,
                left: null,
                right: null
            }
        }
    },
    Cafeteria: {
        name: "Cafeteria",
        status: "OPEN",
        itemsInside: ["Large Table", "Pants"],
        whosInside: [],
        adjecentRooms: function () {
            return {
                forward: null,
                back: this.Corridor,
                left: null,
                right: null
            }
        }
    },
    Kitchen: {
        name: "Kitchen",
        status: "OPEN",
        itemsInside: ["Oven", "Sink", "Drawers"],
        whosInside: []
    },
    TrashRoom: {
        name: "Trash Room",
        status: "CLOSED",
        itemsInside: ["Incinerator"],
        whosInside: []
    },
    BathroomM: {
        name: "Bathroom M",
        status: "OPEN",
        itemsInside: ["Sink", "Urinols", "Stalls"],
        whosInside: []
    },
    BathroomF: {
        name: "Bathroom F",
        status: "OPEN",
        itemsInside: ["Sink", "Stalls"],
        whosInside: []
    },
    Pub: {
        name: "Pub",
        status: "OPEN",
        itemsInside: ["Counter", "Couch"],
        whosInside: []
    },
    ControlRoom: {
        name: "Control Room",
        status: "CLOSED",
        itemsInside: ["Control Panel", "Breaker"],
        whosInside: []
    }
}


export function Location(locationName, status, objectList, charactersInside) {
    this.name = locationName;
    this.status = status;
    this.objectList = objectList;
    this.charactersInside = charactersInside;
}