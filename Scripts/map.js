import { locations } from "./location.js"
import { player } from "./gameManager.js";
import { GameManager } from "./gameManager.js";
import { setMapActive } from "./inputProcessor.js";
import { disableMapButton } from "./inputProcessor.js";


let playerLocationDisplay = document.querySelector("#currentLocation");
const mapScreen = document.querySelector("#currentLocation");
const mapContainer = document.querySelector(".mapContainer");
const mapArrowUi = "&#10094";
const mapLockUi = "&#128274";


export let map = {
    isActive: false,

    setIsActive: function (isActive) {
        this.isActive = isActive;
        setMapActive(isActive);
        switch (isActive) {
            case false:
                mapScreen.classList.add("disabled-screen");
                mapContainer.classList.add("disable-map-highlight");
                break;
            case true:
                mapScreen.classList.remove("disabled-screen");
                mapContainer.classList.remove("disable-map-highlight");
                break;
        }
    },
    displayPlayerLocation: function () {
        playerLocationDisplay.innerHTML = player.location.name;
    },
    updateMapLocation: function (direction) {
        if (!this.isActive) {
            console.log("map is disabled!");
            return;
        }
        let whereTo = this.isDirectionValid(direction);
        playerLocationDisplay.innerHTML = whereTo.name;
        player.updateLocation(whereTo, player.location);
        this.enableValidButtons();

        GameManager.turn();


    },
    isDirectionValid(direction) {
        const roomsToGo = player.location.adjecentRooms();
        console.log(roomsToGo[direction])
        if (!roomsToGo[direction]) {
            return false;
        }
        return roomsToGo[direction];
    },
    enableValidButtons() {
        const roomsToGo = player.location.adjecentRooms();
        let locationIndex = 0;
        let button;
        for (const location of Object.values(roomsToGo)) {
            if (location) {
                if (location.isOpen) {
                    button = disableMapButton(locationIndex, false);
                    button.firstChild.innerHTML = mapArrowUi;
                } else {
                    button = disableMapButton(locationIndex, true)
                    button.firstChild.innerHTML = mapLockUi;
                }

            } else if (this.isActive) {
                button = disableMapButton(locationIndex, true)
                button.firstChild.innerHTML = mapArrowUi;
            }
            locationIndex += 1;
        }
    }
}






