import Character from "./character.js";
import { dayManager } from "./dayManager.js";
import { textQueue } from "./uiData.js";
import { playerFindsWeapon, playerBodyInvestigation, playerWeaponMissing } from "./uiOrganizer.js";
import { updateTextDisplay, caseDetails, charRoomBehaviour } from "./gameManager.js";
import { map } from "./map.js";


export default class Player extends Character {
    constructor(charName, isAlive, gender, location, inventory, investigationReport) {
        super(charName, isAlive, gender, location, inventory, investigationReport);
    }

    investigate() {


        if (!caseDetails["bodyFound"]) {
            this.weaponInvestigation();
        }
        else {
            if (this.isAnyoneDead())
                textQueue.pushIntoQueue(playerBodyInvestigation(caseDetails["murderWeapon"], caseDetails["timeOfDeath"]));
            this.murderInvestigation();
        }




        map.displayItems();

        updateTextDisplay();
    }

    weaponInvestigation() {
        if (this.location.itemsInside[0]) {
            if (!this.investigationReport.hasOwnProperty(`${this.location.name}`)) {
                this.investigationReport[this.location.name] = this.location.itemsInside;
                const item = this.investigationReport[this.location.name][0];
                textQueue.pushIntoQueue(playerFindsWeapon(item.weaponName, this.location.name))
            }
        }
    }

    murderInvestigation() {
        const whosInsideRoom = [...this.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(this), 1);
        if (whosInsideRoom.length >= 1) {
            for (const char of this.location.whosInside)
                char.testify();
        }
    }

    isAnyoneDead() {
        if (this.location.whosInside.includes(caseDetails["victim"])) return true;
        return false;
    }
}

