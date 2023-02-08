import Character from "./character.js";
import { dayManager } from "./dayManager.js";
import { textQueue } from "./uiData.js";
import { playerFindsWeapon, playerBodyInvestigation } from "./uiOrganizer.js";
import { updateTextDisplay, caseDetails } from "./gameManager.js";
import { map } from "./map.js";


export default class Player extends Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport) {
        super(charName, isAlive, gender, location, inventory, investigationReport);
    }

    investigate() {
        if (this.isAnyoneDead()) {
            textQueue.pushIntoQueue(playerBodyInvestigation(caseDetails["murderWeapon"], caseDetails["timeOfDeath"]));
            updateTextDisplay();
        }
        if (this.location.itemsInside[0]) {
            const roomDetails = { [this.location.name]: this.location.itemsInside };
            if (!this.investigationReport.hasOwnProperty(`${this.location.name}`)) {
                this.investigationReport[this.location.name] = this.location.itemsInside;
            }
            const itemList = this.investigationReport[this.location.name][0];
            textQueue.pushIntoQueue(playerFindsWeapon(itemList[0], this.location.name))
            updateTextDisplay();

            map.displayItems();

        }
    }

    isAnyoneDead() {
        if (this.location.whosInside.includes(caseDetails["victim"])) return true;
        return false;
    }
}

