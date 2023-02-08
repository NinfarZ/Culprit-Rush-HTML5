import { GameManager, player } from "./gameManager.js";
import { characterList } from "./gameManager.js";
import { dayManager } from "./dayManager.js";
import { disableContinueButton, hideContinueButton, hideInvestigationButton } from "./inputProcessor.js";
import { map } from "./map.js";


const mainBox = document.querySelector(".mainbox");
const mainText = document.querySelector(".text");


class UiArray {
    constructor(textArray) {
        this.textArray = textArray;

    }

    displayText() {
        if (this.isArrayEmpty()) return;
        console.log(this.textArray);
        typeOut(this.textArray.shift())

    }

    isArrayEmpty() {
        return !this.textArray.length ? true : false;
    }
}

// const introText = new UiArray(["Welcome.", "You're trapped inside a mysterious building with 10 other people.",
//     `One of them is dangerous. And will attack at a moment's notice.`,
//     `You must uncover the culprit to escape.`]);
// const mapTutorialText = new UiArray([`Use the map interface below to move around.`,
//     `Keep in mind that every move you make spends a turn.`,
//     `On each turn, time will pass, and everyone will perform an action.`,
//     `So watch out.`,
//     `The culprit is on the move...`]);
// const findingPeopleExploring = new UiArray([`In the ${player.location} you see ${listCharacters(player.location.whosInside)}`]);



// export let textQueue = [introText];
// let queueIndex = 0;

class TextQueue {
    constructor(queue) {
        this.queue = queue;
    }

    pushIntoQueue(text) {
        this.queue.push(convertToUiArray(text));
        console.log(this.queue);
    }


    isQueueEmpty() {
        return !this.queue.length ? true : false;
    }

    removeUiArrayFromQueue() {
        this.queue.shift();
    }

    updateStoryMessage() {
        if (this.queue[0].isArrayEmpty()) {
            this.removeUiArrayFromQueue();
        }
        if (!this.isQueueEmpty()) {
            hideContinueButton(false);
            hideInvestigationButton(true);
            map.setIsActive(false);
        } else {
            hideContinueButton(true);
            hideInvestigationButton(false);

            map.setIsActive(true);
            return;
        }

        this.queue[0].displayText();

    }
}

function convertToUiArray(text) {
    const newText = new UiArray(text);
    return newText;
}

export const textQueue = new TextQueue([]);

export function displayNothing() {
    mainText.innerHTML = ". . .";
}



export function typeOut(text, displayArea = mainText) {
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





