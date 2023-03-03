import { textQueue } from "./uiData.js";
import { mainButton, continueButton, mapInput, investigationButton, culpritSubmitButton, suspectRadioButtons } from "./inputManager.js";
import { GameManager, player, submitSuspect } from "./gameManager.js";
import { map } from "./map.js";

mainButton.addEventListener("click", startGame);
continueButton.addEventListener("click", continueText);
investigationButton.addEventListener("click", handleInvestigate);
culpritSubmitButton.addEventListener("click", handleCulpritSubmit);

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

function handleCulpritSubmit() {
    const selectedSuspect = document.querySelectorAll('input[name="suspect"]:checked');
    if (selectedSuspect.length > 1) return;
    submitSuspect(selectedSuspect[0].value);
}

export function hideInvestigationButton(setHide) {
    setHide ? investigationButton.style.display = "none" : investigationButton.style.display = "inline";
}

export function hideSubmitButton(setHide) {
    setHide ? culpritSubmitButton.style.display = "none" : culpritSubmitButton.style.display = "static";
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

// function updateButtonBorder(button, setDisabled) {
//     setDisabled ? button.classList.add(`map-${button.id}--disabled`) : button.classList.remove(`map-${button.id}--disabled`);
// }


export function disableContinueButton(setDisabled) {
    continueButton.disabled = setDisabled;
    setDisabled ? continueButton.classList.add("disabled-button") : continueButton.classList.remove("disabled-button");
}

export function disableInvestigateButton(setDisabled) {
    investigationButton.disabled = setDisabled;
    setDisabled ? investigationButton.classList.add("disabled-button") : investigationButton.classList.remove("disabled-button");
}

export function disableSubmitButton(setDisabled) {
    culpritSubmitButton.disabled = setDisabled;
    setDisabled ? culpritSubmitButton.classList.add("disabled-button") : culpritSubmitButton.classList.remove("disabled-button");
}

export function disableAllButtons(setDisabled) {
    setMapActive(setDisabled);
    disableContinueButton(setDisabled);


}

export function removeRadioButtons(charNames) {
    for (const button of suspectRadioButtons) {
        if (charNames.includes(button.value)) button.parentElement.remove();
    }
}

export function hideContinueButton(setHide) {
    setHide ? continueButton.style.display = "none" : continueButton.style.display = "block";
    setHide ? setMapActive(true) : setMapActive(false);
}