import { locations } from "./location.js"
import { player } from "./gameManager.js";
import { GameManager, advanceTime } from "./gameManager.js";
import { hideInvestigationButton, setMapActive } from "./inputProcessor.js";
import { disableMapButton, disableInvestigateButton } from "./inputProcessor.js";
import { playerWeaponMissing } from "./uiOrganizer.js";
import { textQueue } from "./uiData.js";




let playerLocationDisplay = document.querySelector("#location");
const whosThere = document.querySelector(".map-control__people-inside--names");
//const itemsInside = document.querySelector(".items-inside-names");
const mapScreen = document.querySelector(".map-control__directional-pad--location");
const mapContainer = document.querySelector(".map-control__directional-pad");
const mapArrowUi = "&#10094";
const mapLockUi = "&#128274";
const missingItemList = [];


export let map = {
    isActive: false,

    setIsActive: function (isActive) {
        this.isActive = isActive;
        setMapActive(isActive);
        if (isActive) {
            this.enableValidButtons();
            this.displayPlayerLocation();
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
    updateMapLocation: function (direction) {
        if (!this.isActive) return;
        let whereTo;
        const isSkipTime = advanceTime();
        if (isSkipTime) whereTo = locations.MyBedroom;
        else whereTo = this.isDirectionValid(direction);

        player.updateLocation(whereTo, player.location);
        playerLocationDisplay.innerHTML = whereTo.name;
        this.enableValidButtons();

        whosThere.innerHTML = "";
        GameManager[GameManager.gameState]();

        this.displayWhosThere();
        //player.location.name in player.investigationReport &&  ? hideInvestigationButton(true) : hideInvestigationButton(false);
        this.canInvestigate();


    },

    canInvestigate() {
        switch (GameManager.gameState) {
            case ("turn"):
                if (player.location.name in player.investigationReport) {
                    if (!player.investigationReport[player.location.name]) hideInvestigationButton(true);
                    else hideInvestigationButton(false);
                }
                else hideInvestigationButton(false);
                break;
            case ("murderInvestigation"):
                if (player.location.whosInside.length > 1) hideInvestigationButton(false);
                else hideInvestigationButton(true);
        }

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
                    this.updateLocationBorder(button, false);
                    button.firstChild.innerHTML = location.name;
                } else {
                    button = disableMapButton(locationIndex, true)
                    button.firstChild.innerHTML = mapLockUi;
                }

            } else if (this.isActive) {
                button = disableMapButton(locationIndex, true)
                this.updateLocationBorder(button, true);
                button.firstChild.innerHTML = "";

            }
            locationIndex += 1;
        }
    },

    updateLocationBorder(button, setDisabled) {
        if (setDisabled) {
            playerLocationDisplay.classList.add(`map-${button.id}--disabled`);
            button.classList.add("map-button--general-disable");
        }

        else {
            playerLocationDisplay.classList.remove(`map-${button.id}--disabled`);
            button.classList.remove("map-button--general-disable");
        }
    }
}







