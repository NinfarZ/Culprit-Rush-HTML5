import { locations } from "./location.js"
import { player } from "./gameManager.js";
import { GameManager } from "./gameManager.js";

let playerLocationDisplay = document.querySelector("#currentLocation");
const buttonForward = document.querySelector("#mapTop");
const buttonBack = document.querySelector("#mapBottom");
const buttonLeft = document.querySelector("#mapLeft");
const buttonRight = document.querySelector("#mapRight");
const mapScreen = document.querySelector("#currentLocation");
const mapContainer = document.querySelector(".mapContainer");
const mapInput = [buttonForward, buttonBack, buttonLeft, buttonRight];
const mapArrowUi = "&#10094";
const mapLockUi = "&#128274";

for (const input of mapInput) {
    input.addEventListener("click", function () {
        console.log(`pressed ${input}!`);
        map.handleMapInput(input);
    })
}
export let map = {
    isActive: false,

    setIsActive: function (isActive) {
        this.isActive = isActive;
        switch (isActive) {
            case false:
                for (const button of mapInput) {
                    button.disabled = true;
                    button.classList.add("disabled-button");
                }
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
    handleMapInput: function (input) {
        if (!this.isActive) {
            console.log("map is disabled!");
            return;
        }
        let whereTo;
        switch (input) {
            case buttonForward:
                whereTo = this.isDirectionValid("forward");
                if (whereTo) {
                    playerLocationDisplay.innerHTML = whereTo.name;
                    player.updateLocation(whereTo, player.location);
                }
                break;
            case buttonBack:
                whereTo = this.isDirectionValid("back");
                if (whereTo) {
                    playerLocationDisplay.innerHTML = whereTo.name;
                    player.updateLocation(whereTo, player.location);
                }
                break;
            case buttonLeft:
                whereTo = this.isDirectionValid("left");
                if (whereTo) {
                    playerLocationDisplay.innerHTML = whereTo.name;
                    player.updateLocation(whereTo, player.location);
                }
                break;
            case buttonRight:
                whereTo = this.isDirectionValid("right");
                if (whereTo) {
                    playerLocationDisplay.innerHTML = whereTo.name;
                    player.updateLocation(whereTo, player.location);
                }
                break;
        }
        GameManager.turn();
        this.enableValidButtons();

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
        for (const location of Object.values(roomsToGo)) {
            if (location) {
                if (location.isOpen) {
                    mapInput[locationIndex].disabled = false
                    mapInput[locationIndex].classList.remove("disabled-button");
                    mapInput[locationIndex].firstChild.innerHTML = mapArrowUi;
                } else {
                    mapInput[locationIndex].disabled = true;
                    mapInput[locationIndex].classList.add("disabled-button");
                    mapInput[locationIndex].firstChild.innerHTML = mapLockUi;
                }

            } else if (this.isActive) {
                mapInput[locationIndex].disabled = true;
                mapInput[locationIndex].classList.add("disabled-button");
                mapInput[locationIndex].firstChild.innerHTML = mapArrowUi;
            }
            locationIndex += 1;
        }
    }
}






