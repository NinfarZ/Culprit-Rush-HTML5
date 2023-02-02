import { displayStoryMessage } from "./uiData.js";
import { mainButton, continueButton, mapInput } from "./inputManager.js";
import { GameManager } from "./gameManager.js";
import { map } from "./map.js";

mainButton.addEventListener("click", startGame);
continueButton.addEventListener("click", continueText);

function continueText() {
    displayStoryMessage();
}
function startGame() {
    GameManager.setGameStart();
}

for (const input of mapInput) {
    input.addEventListener("click", function () {
        handleMapInput(input);
    })
}

function handleMapInput(input) {
    map.updateMapLocation(input.id);
}

export function setMapActive(state) {
    for (const button of mapInput) {
        state === false ? button.classList.add("disabled-button") : button.classList.remove("disabled-button");
        button.disabled = !state;
    }
}

export function disableMapButton(buttonIndex, setDisabled) {
    const button = mapInput[buttonIndex];
    setDisabled ? button.classList.add("disabled-button") : button.classList.remove("disabled-button");
    button.disabled = setDisabled;
    return button;
}

export function disableContinueButton(setDisabled) {
    continueButton.disabled = setDisabled;
    setDisabled ? continueButton.classList.add("disabled-button") : continueButton.classList.remove("disabled-button");
}

export function disableAllButtons(setDisabled) {
    setMapActive(setDisabled);
    disableContinueButton(setDisabled);


}

export function hideContinueButton(setHide) {
    setHide ? continueButton.style.display = "none" : continueButton.style.display = "block";
    setHide ? setMapActive(true) : setMapActive(false);
}