import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations } from "./location.js";
import { characterList } from "./character.js";
import { currentIndex } from "./uiData.js";
import { typeOut } from "./uiData.js";
import { uiData } from "./uiData.js";
import { map } from "./map.js";

let GameManager = {
    setGameStart: function () {
        mainBox.classList.add("mainBoxBorder");
        mainBox.append(continueButton);
        typeOut(currentUiDataState["0_0"].text(), mainText);
        map.displayPlayerLocation();
    },
    resetPlayer: function () {
        return;
    },
}

let currentUiDataState = uiData.intro;
export let player = new Player(null, true, "M", locations.MyBedroom, null);
const continueButton = document.createElement("button");
continueButton.innerHTML = ">>>";

continueButton.setAttribute("id", "continueButton");
const mainBox = document.querySelector(".mainbox");
const mainText = document.querySelector("#text");
const mainInfoDisplay = document.createElement("DIV");
const mainButton = document.querySelector("#startbutton");
let inputButton = null;
let playerInput = null;
mainButton.addEventListener("mouseover", mouseOver);
mainButton.addEventListener("mouseout", mouseOut);
mainButton.addEventListener("click", hideStartButton);
continueButton.addEventListener("click", nextStoryMessage);


function mouseOver() {
    mainBox.classList.add("tilt");
}

function mouseOut() {
    mainBox.classList.remove("tilt");
}

function createPlayer() {
    if (!playerInput.value) return;

    player.charName = playerInput.value;
    GameManager.setGameStart();
}

function nextStoryMessage() {
    let nextText = currentUiDataState[currentIndex].next;
    //mainBox.innerHTML = currentUiDataState[nextText].text();
    typeOut(currentUiDataState[nextText].text(), mainText);
}

function displayCharacterName(charList) {
    if (charList.length === 0) {
        return;
    }
    let content = document.createElement("SPAN");
    let pickedChar = charList.splice(0, 1);
    console.log(charList);
    content.innerHTML = `${pickedChar[0].charName} `;
    content.style.color = "green";
    mainText.append(content);

    setTimeout(function () {
        displayCharacterName(charList);
    }, 500);
}

function displayCurrentPosition() {
    let p = document.createElement("P");
    p.innerHTML = map.moveToPosition("left", player).name;
    mainBox.append(p);
}

function hideStartButton() {
    mainText.innerHTML = `
    <label for='nameInput'>Enter your name:</label>
    <input id='nameInput' type='text'></input>
    <div>
    <button id='inputButton'>Done!</button>
    </div>
    `;
    inputButton = document.querySelector("#inputButton");
    playerInput = document.querySelector("#nameInput");
    inputButton.addEventListener("click", createPlayer);
}





