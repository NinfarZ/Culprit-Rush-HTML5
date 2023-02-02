import { GameManager, player } from "./gameManager.js";
import { characterList } from "./gameManager.js";
import { dayManager } from "./dayManager.js";
import { disableContinueButton, hideContinueButton } from "./inputProcessor.js";


//object for the text data to be displayed on the main text display
export let uiData = {
    currentIndex: "0_0",
    currentUiState: "intro",

    "intro": {
        "0_0": {
            text: function () {
                return `Welcome.`
            },

            next: function () {
                uiData.currentIndex = "0_1"
                uiData.currentUiState = "intro"
            }
        },

        "0_1": {
            text: function () {
                return `And you're trapped inside a mysterious building with 10 other people.`
            },
            next: function () {
                uiData.currentIndex = "0_2"
            }

        },
        "0_2": {
            text: function () {

                return listCharacters(characterList) + ".";
            },
            next: function () {
                uiData.currentIndex = "0_3"
            }
        },
        "0_3": {
            text: function () {

                return `One of them is behind this.
                And they will attack at a moment's notice.`
            },
            next: function () {
                uiData.currentIndex = "0_4"
            }
        },
        "0_4": {
            text: function () {

                return `You must uncover the culprit and escape.`
            },
            next: function () {
                uiData.currentIndex = "1_0"
                uiData.currentUiState = "tutorial";
            }

        }
    },
    "tutorial": {
        "1_0": {
            text: function () {
                GameManager.tutorialPhase();
                hideContinueButton(true);
                return `You can use the map interface below to move around.`
            },
        }
    },
    "locationInfo": {
        "2_0": {
            text: function (location, whosInside) {
                return `You walk into the ${location.name}. 
                Inside with you ${whosInside.length > 1 ? "are" : "is"} ${listCharacters(whosInside)}.`
            }
        }
    }
}

const mainBox = document.querySelector(".mainbox");
const mainText = document.querySelector(".text");

function setNextTextIndex() {
    const currentText = uiData[uiData.currentUiState][uiData.currentIndex]
    Object.keys(currentText).includes("next") ? currentText.next() : null;
}

function getTextToDisplay() {
    return uiData[uiData.currentUiState][uiData.currentIndex].text();
}

export function displayStoryMessage() {
    typeOut();
    setNextTextIndex();
}






export function typeOut(text = getTextToDisplay(), displayArea = mainText) {
    let i = 0;
    disableContinueButton(true);

    displayArea.innerHTML = "";
    let interval = setInterval(() => {
        if (i < text.length) {
            displayArea.innerHTML += text[i];
            i++;
        } else {

            disableContinueButton(false);
            clearInterval(interval);
        }
    }, 30);
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


