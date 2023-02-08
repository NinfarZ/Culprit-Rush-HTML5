import { locations } from "./location.js"
import { player } from "./gameManager.js";
import { GameManager, advanceTime } from "./gameManager.js";
import { setMapActive } from "./inputProcessor.js";
import { disableMapButton } from "./inputProcessor.js";


let playerLocationDisplay = document.querySelector("#currentLocation");
const whosThere = document.querySelector(".people-inside-names");
const itemsInside = document.querySelector(".items-inside-names");
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

                mapContainer.classList.add("disable-map-highlight");
                break;
            case true:
                this.enableValidButtons();
                this.displayPlayerLocation();
                mapScreen.style.display = "flex";
                mapContainer.classList.remove("disable-map-highlight");
                break;
        }
    },
    displayPlayerLocation: function () {
        playerLocationDisplay.innerHTML = player.location.name;
    },

    displayWhosThere: function () {
        for (const char of player.location.whosInside) {
            if (char !== player) {
                const li = document.createElement("LI");
                char.isAlive ? li.style.color = "white" : li.style.color = "red";
                li.innerHTML = char.charName;
                whosThere.append(li);
            }

        }
    },
    displayItems: function () {
        itemsInside.innerHTML = "";
        if (!player.investigationReport.hasOwnProperty(`${player.location.name}`)) return;

        for (const item of player.location.itemsInside) {
            const li = document.createElement("LI");
            li.innerHTML = item.weaponName;
            itemsInside.append(li);
        }
    },
    updateMapLocation: function (direction) {
        if (!this.isActive) return;

        let whereTo = this.isDirectionValid(direction);
        playerLocationDisplay.innerHTML = whereTo.name;
        player.updateLocation(whereTo, player.location);
        this.enableValidButtons();
        this.displayItems();
        advanceTime();

        whosThere.innerHTML = "";
        GameManager[GameManager.gameState]();


    },
    isDirectionValid(direction) {
        const roomsToGo = player.location.adjecentRooms;
        console.log(roomsToGo[direction])
        if (!roomsToGo[direction]) {
            return false;
        }
        return roomsToGo[direction];
    },
    enableValidButtons() {
        const roomsToGo = player.location.adjecentRooms;
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






