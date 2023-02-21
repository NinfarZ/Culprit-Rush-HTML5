import { GameManager, player } from "./gameManager.js";
import { characterList } from "./gameManager.js";
import { dayManager } from "./dayManager.js";
import { disableContinueButton, disableInvestigateButton, hideContinueButton, hideInvestigationButton } from "./inputProcessor.js";
import { map } from "./map.js";


const mainText = document.querySelector(".display__text");


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
            disableInvestigateButton(true);
            map.setIsActive(false);
        } else {
            hideContinueButton(true);
            disableInvestigateButton(false);

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
    }, 15);
}





