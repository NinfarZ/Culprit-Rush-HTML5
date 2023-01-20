import { locations } from "./location.js"
import { player } from "./gameManager.js";

let playerLocationDisplay = document.querySelector("#currentLocation");
const buttonForward = document.querySelector("#mapTop");
const buttonBack = document.querySelector("#mapBottom");
const buttonLeft = document.querySelector("#mapLeft");
const buttonRight = document.querySelector("#mapRight");
export let map = {
    displayPlayerLocation: function () {
        playerLocationDisplay.innerHTML = player.location.name;
    },

}






