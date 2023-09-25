import Character from "./character.js";
import { dayManager } from "./dayManager.js";
import { textQueue } from "./uiData.js";
import { playerFindsWeapon, playerBodyInvestigation, playerWeaponMissing } from "./uiOrganizer.js";
import { updateTextDisplay, caseDetails, charRoomBehaviour, victim } from "./gameManager.js";
import { map } from "./map.js";
import { hideInvestigationButton } from "./inputProcessor.js";

const caseDetailsList = document.querySelector(".map-control__investigation--case-details-list");
const caseDetailsDisplay = document.querySelector(".map-control__investigation--case-details");
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
                textQueue.pushIntoQueue(playerBodyInvestigation(caseDetails["murderWeapon"], caseDetails["timeOfDeathDisplay"]));
                textQueue.pushIntoQueue([caseDetails["murderWeapon"].weaponClass.classRules]);
                if (!caseDetailsUpdated) this.updateCaseDetailsDisplay();
            }
            this.murderInvestigation();
        }

        updateTextDisplay();
    }

    updateCaseDetailsDisplay() {
        const victim = caseDetails["victim"].map(char => char.charName);
        const location = caseDetails["crimeScene"].map(location => location.name);
        const timeOfDeath = caseDetails["timeOfDeathDisplay"];
        const murderWeapon = caseDetails["murderWeapon"].weaponName;

        const details = ["Victim(s): " + victim, "Location(s): " + location, "Time: " + timeOfDeath, "Weapon: " + murderWeapon];

        for (const detail of details) {
            const li = document.createElement("LI");
            li.innerHTML = detail;
            caseDetailsList.append(li);
        }
        caseDetailsDisplay.display = "static";
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
        if (caseDetails["crimeScene"].includes(this.location)) return true;
        return false;
    }
}

