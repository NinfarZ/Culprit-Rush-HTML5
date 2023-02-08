import { textQueue } from "./uiData.js";
import { mainButton, continueButton, mapInput, investigationButton } from "./inputManager.js";
import { GameManager, player } from "./gameManager.js";
import { map } from "./map.js";

mainButton.addEventListener("click", startGame);
continueButton.addEventListener("click", continueText);
investigationButton.addEventListener("click", handleInvestigate);

function continueText() {
    textQueue.updateStoryMessage();
}
function startGame() {
    GameManager.setGameStart();
    mainButton.style.display = "none";
}

for (const input of mapInput) {
    input.addEventListener("click", function () {
        handleMapInput(input);
    })
}

function handleInvestigate() {
    player.investigate();
}

function handleMapInput(input) {
    map.updateMapLocation(input.id);
}

export function hideInvestigationButton(setHide) {
    setHide ? investigationButton.style.display = "none" : investigationButton.style.display = "inline";
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