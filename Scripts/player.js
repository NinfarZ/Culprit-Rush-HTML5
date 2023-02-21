import Character from "./character.js";
import { dayManager } from "./dayManager.js";
import { textQueue } from "./uiData.js";
import { playerFindsWeapon, playerBodyInvestigation, playerWeaponMissing } from "./uiOrganizer.js";
import { updateTextDisplay, caseDetails, charRoomBehaviour } from "./gameManager.js";
import { map } from "./map.js";
import { hideInvestigationButton } from "./inputProcessor.js";

const caseDetailsDisplay = document.querySelector(".map-control__investigation--case-details-list");
let caseDetailsUpdated = false;

export default class Player extends Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport) {
        super(charName, isAlive, gender, location, inventory, investigationReport);
    }

    investigate() {


        if (!caseDetails["bodyFound"]) {
            this.weaponInvestigation();
        }
        else {
            if (this.isAnyoneDead()) {
                textQueue.pushIntoQueue(playerBodyInvestigation(caseDetails["murderWeapon"], caseDetails["timeOfDeath"]));
                if (!caseDetailsUpdated) this.updateCaseDetailsDisplay();
            }
            this.murderInvestigation();
        }

        updateTextDisplay();
    }

    updateCaseDetailsDisplay() {
        const victim = caseDetails["victim"].charName;
        const location = caseDetails["crimeScene"].name;
        const timeOfDeath = caseDetails["timeOfDeath"];
        const murderWeapon = caseDetails["murderWeapon"].weaponName;

        const details = ["Victim: " + victim, "Location: " + location, "Time: " + timeOfDeath, "Weapon: " + murderWeapon];

        for (const detail of details) {
            const li = document.createElement("LI");
            li.innerHTML = detail;
            caseDetailsDisplay.append(li);
        }
        caseDetailsUpdated = true;
    }

    weaponInvestigation() {

        if (!this.investigationReport.hasOwnProperty(`${this.location.name}`)) {
            if (this.location.itemsInside[0]) {
                this.investigationReport[this.location.name] = this.location.itemsInside;
                const item = this.investigationReport[this.location.name][0];
                textQueue.pushIntoQueue(playerFindsWeapon(item.weaponName, this.location.name))
            } else {
                this.investigationReport[this.location.name] = null;
                textQueue.pushIntoQueue(["Nothing inside."]);
                hideInvestigationButton(true);
            }

        } else if (this.investigationReport[this.location.name]) {
            const item = this.investigationReport[this.location.name][0];
            if (this.location.itemsInside[0]) {
                textQueue.pushIntoQueue([`The ${item.weaponName} is still here.`]);
            } else {
                textQueue.pushIntoQueue([`The weapon is missing...`]);
                this.investigationReport[this.location.name] = null;
                hideInvestigationButton(true);
            }
        }
    }

    murderInvestigation() {
        const whosInsideRoom = [...this.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(this), 1);
        if (whosInsideRoom.length >= 1) {
            for (const char of whosInsideRoom)
                char.testify();
        }
    }

    isAnyoneDead() {
        if (this.location.whosInside.includes(caseDetails["victim"])) return true;
        return false;
    }
}

