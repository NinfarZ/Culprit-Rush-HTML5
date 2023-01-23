import { player } from "./gameManager.js";
import { characterList } from "./gameManager.js";
import { continueButton } from "./gameManager.js";
import { map } from "./map.js";


export let uiData = {
    intro: {
        "0_0": {
            text: function () {
                currentIndex = "0_0";
                return `You are ${player.charName}.`
            },

            next: "0_1"
        },

        "0_1": {
            text: function () {
                currentIndex = "0_1";
                return `And you're trapped inside a mysterious building with 10 other people.`
            },
            next: "0_2"

        },
        "0_2": {
            text: function () {
                currentIndex = "0_2";
                return listCharacters(characterList) + ".";
            },
            next: "0_3"
        },
        "0_3": {
            text: function () {
                currentIndex = "0_3";
                return `One of them is behind this.
                And they will attack at a moment's notice.`
            },
            next: "0_4last"
        },
        "0_4last": {
            text: function () {
                currentIndex = "0_4last";
                return `You must uncover the culprit and escape.`
            },
            next: "1_0"
        }
    },
    tutorial: {
        "1_0": {
            text: function () {
                currentIndex = "1_0";
                continueButton.classList.add("disabled");
                //map.setIsActive(true);
                //map.displayPlayerLocation();
                //map.enableValidButtons();
                return `You can use the map interface below to move around.`
            },
            next: "1_1"
        },
        "1_1": {

        }
    },
    locationInfo: {
        "2_0": {
            text: function (location, whosInside) {
                currentIndex = "2_0";
                continueButton.classList.remove("disabled");
                return `You walk into the ${location.name}. 
                Inside with you ${whosInside.length > 1 ? "are" : "is"} ${listCharacters(whosInside)}.`
            },
            next: "2_1"
        },
        "2_1": {
            text: function () {
                return `What do you want to do?`;
            }
        }
    }
}


export let currentIndex = "0_0";
export let isTypingOut = false;

export function typeOut(text, displayArea) {
    let i = 0;
    continueButton.disabled = true;
    map.setIsActive(false);

    displayArea.innerHTML = "";
    let interval = setInterval(() => {
        if (i < text.length) {
            displayArea.innerHTML += text[i];
            i++;
        } else {
            if (!continueButton.classList.contains("disabled")) {
                continueButton.disabled = false;
            } else {
                map.setIsActive(true)
                map.displayPlayerLocation();
                map.enableValidButtons();
            }

            clearInterval(interval);
        }
    }, 50);
}

function listCharacters(characterList) {
    let namesString = " ";
    if (characterList.length === 1) {
        namesString = characterList[0].charName;
        return namesString;
    }
    for (let i = 0; i < characterList.length; i++) {
        if (i === characterList.length - 1) {
            namesString = namesString + " and " + characterList[i].charName;
        } else {
            namesString += characterList[i].charName + ", ";
        }

    }
    return namesString;
}

function setButtonsState(state) {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
        if (!button.classList.contains("disabled")) {
            button.disabled = state;
        }

    }
}

