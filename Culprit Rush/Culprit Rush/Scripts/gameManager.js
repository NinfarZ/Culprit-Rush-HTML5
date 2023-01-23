import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations, hideWeapons } from "./location.js";
import { currentIndex } from "./uiData.js";
import { typeOut, uiData } from "./uiData.js";
import { map } from "./map.js";
import Character from "./character.js";
import Killer from "./killer.js";

const john = new Character("John", true, "M", locations.Cafeteria, []);
const jeff = new Character("Jeff", true, "M", locations.Cafeteria, []);
const maria = new Character("Maria", true, "F", locations.Cafeteria, []);
const sarah = new Character("Sarah", true, "F", locations.Cafeteria, []);
const james = new Character("James", true, "M", locations.Cafeteria, []);
const steve = new Character("Steve", true, "M", locations.Cafeteria, []);
const linda = new Character("Linda", true, "F", locations.Cafeteria, []);
const laela = new Character("Laela", true, "F", locations.Cafeteria, []);
const amy = new Character("Amy", true, "F", locations.Cafeteria, []);
const makoto = new Character("Makoto", true, "M", locations.Cafeteria, []);

export let characterList = [john, jeff, maria, sarah, james, steve, linda, laela, amy, makoto];

let chooseKiller = characterList.splice(Math.floor(Math.random() * characterList.length), 1);
let killer = new Killer(chooseKiller[0], true, chooseKiller[0].gender, chooseKiller[0].location, [], [], null);

export let GameManager = {
    setGameStart: function () {
        hideWeapons()
        mainBox.classList.add("mainBoxBorder");
        mainBox.append(continueButton);
        typeOut(currentUiDataState["0_0"].text(), mainText);
    },
    tutorial: function () {
        mainBox.style.color = "#4d3dfc";
        for (const char of characterList) {
            char.turn()
        }
        currentUiDataState = uiData.tutorial;
    },
    turn: function () {

        currentUiDataState = uiData.locationInfo;
        let whosInsideRoom = [...player.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(player), 1);
        if (whosInsideRoom.length > 0) {
            typeOut(currentUiDataState["2_0"].text(player.location, whosInsideRoom), mainText);
        } else {
            typeOut("There's no one here.", mainText);
        }

        for (const char of characterList) {
            char.turn()
        }

    }
}


let currentUiDataState = uiData.intro;
export let player = new Player(null, true, "M", locations.MyBedroom, null);
export const continueButton = document.createElement("button");
continueButton.innerHTML = "&raquo;";

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
map.setIsActive(false);


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
    switch (currentIndex) {
        case "0_4last":
            GameManager.tutorial();
            break;
    }
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





