import { player } from "./gameManager.js";
import { characterList } from "./character.js";


export let uiData = {
    intro: {
        "0_0": {
            text: function () {
                currentIndex = "0_0";
                return `You're a ${player.gender === "M" ? "man" : "woman"} named ${player.charName}.`
            },

            next: "0_1"
        },

        "0_1": {
            text: function () {
                currentIndex = "0_1";
                return `And you're trapped inside an abandoned school with 10 other people.`
            },
            next: "0_2"

        },
        "0_2": {
            text: function () {
                currentIndex = "0_2";
                let namesString = " ";
                for (let i = 0; i < characterList.length; i++) {
                    if (i === characterList.length - 1) {
                        namesString += " and ";
                    }
                    namesString += characterList[i].charName + " ";
                }
                return namesString;
            },
            next: "0_3"
        },
        "0_3": {
            text: function () {
                currentIndex = "0_3";
                return `One of them is a murderer 
                and will attack at a moment's notice.`
            },
            next: "0_4"
        },
        "0_4": {
            text: function () {
                currentIndex = "0_4";
                return `You must be prepared. 
                Keep an eye out for clues.`
            },
            next: "0_5"
        }
    }
}

export let currentIndex = "0_0";

export function typeOut(text, displayArea) {
    let i = 0;
    displayArea.innerHTML = "";
    setButtonsState(true);
    let interval = setInterval(() => {
        if (i < text.length) {
            displayArea.innerHTML += text[i];
            i++;
        } else {
            setButtonsState(false);
            clearInterval(interval);
        }
    }, 50);
}

function setButtonsState(state) {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
        button.disabled = state;
    }
}

