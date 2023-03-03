import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations, hideWeapons } from "./location.js";
import { textQueue, displayNothing } from "./uiData.js";
import { map } from "./map.js";
import { dayManager } from "./dayManager.js";
import Character from "./character.js";
import Killer from "./killer.js";
import * as uiModel from "./uiOrganizer.js";
import { hideSubmitButton, removeRadioButtons } from "./inputProcessor.js";



export const player = new Player("you", true, "M", locations.MyBedroom);
const vanessa = new Character("Vanessa", true, "F", locations.Cafeteria);
const james = new Character("James", true, "M", locations.Cafeteria);
const steve = new Character("Steve", true, "M", locations.Cafeteria);
const wanda = new Character("Wanda", true, "F", locations.Cafeteria);
const laela = new Character("Laela", true, "F", locations.Cafeteria);
const makoto = new Character("Makoto", true, "M", locations.Cafeteria);

export let characterList = [vanessa, james, steve, wanda, laela, makoto];

const chooseKiller = characterList.splice(Math.floor(Math.random() * characterList.length), 1);
const killerValues = Object.values(chooseKiller[0]);
export const killer = new Killer(killerValues[0], killerValues[1], killerValues[2], killerValues[3], null, null);
characterList.push(killer);

let killingAnnouncement = false;
let crimeDiscovered = false;
export let victim = null;
let timeOfDeath = null;
let murderWeapon = null;
let victimsFound = [];

export let caseDetails = {};


export let GameManager = {
    gameState: "turn",
    setGameStart: function () {

        for (const char of characterList) {
            char.randomizeLocation();
            char.startMood();

        }
        map.setIsActive(false);
        hideWeapons()
        textQueue.pushIntoQueue(uiModel.introText());
        textQueue.pushIntoQueue(uiModel.mapTutorialText());

        updateTextDisplay();


    },
    tutorialPhase: function () {
        map.setIsActive(true);

    },
    "turn": function () {


        //first every character moves to a random adjacent room
        for (const char of characterList) {
            char.turn()
        }

        //then the killer will investigate the room, followed by the innocent characters
        if (!Object.keys(caseDetails).length) killer.investigate();
        for (const char of characterList.filter(char => char !== killer)) {
            if (!Object.keys(caseDetails).length) char.investigate();
        }

        //the mood of each character will change depending on the average mood of those around them
        for (const location of Object.values(locations)) {
            const averageMood = getAvgMood(location.whosInside);
            updateGroupMood(averageMood, location.whosInside);
        }

        //if someone's in the room with them player, they'll display behaviour according to their mood
        if (player.location.whosInside.length >= 1) charRoomBehaviour();

        //if the killer found the weapon during their investigation, they'll attempt an attack
        if (killer.weapon) {
            killer.searchForKill();
            if (killer.hasKilled) killer.lie(); //the killer will investigate again and fabricate a lie about their crime
        }

        //if a murder occured and the weapon is noisy, a message will be displayed
        if (Object.keys(caseDetails).length !== 0) {
            if (caseDetails["murderWeapon"].isNoisy) {
                textQueue.pushIntoQueue(uiModel.killingSound(caseDetails["victim"][0].location));

            }
        }

        //called each turn to display text on the screen
        updateTextDisplay();

    },

    "bodySearch": function () {


        for (const char of characterList) {
            char.turn();
        }

        for (const location of Object.values(locations)) {
            const averageMood = getAvgMood(location.whosInside);
            updateGroupMood(averageMood, location.whosInside);
        }

        if (caseDetails["crimeScene"].includes(player.location)) {
            const victims = player.location.whosInside.filter(char => !char.isAlive && !victimsFound.includes(char));
            victimsFound.push(...victims);

            if (!caseDetails["bodyFound"]) {
                textQueue.pushIntoQueue(uiModel.bodyDiscovery(player.location, victims));
                if (victimsFound.length < caseDetails["victim"].length) {
                    const otherLocation = caseDetails["crimeScene"].filter(location => location !== player.location);
                    textQueue.pushIntoQueue(uiModel.bodyDiscoveryNotOver(otherLocation[0]));
                }
                caseDetails["bodyFound"] = true;
            }

        }
        if (victimsFound.length === caseDetails["victim"].length) {

            textQueue.pushIntoQueue(uiModel.bodyInvestigationIntro(victimsFound));
            hideSubmitButton(false);
            this.gameState = "murderInvestigation";
        }

        updateTextDisplay();

    },

    "murderInvestigation": function () {
        console.log("it's time to investigate the truth");



        updateTextDisplay();
    }
}

export function charRoomBehaviour() {

    const whosInsideRoom = [...player.location.whosInside];
    whosInsideRoom.splice(whosInsideRoom.indexOf(player), 1);

    if (whosInsideRoom.length === 1) textQueue.pushIntoQueue(uiModel.behaviourSolo(whosInsideRoom));
    if (whosInsideRoom.length > 1) textQueue.pushIntoQueue(uiModel.behaviourGroup(whosInsideRoom));
}


export function onCharKilled(victimList) {
    GameManager.gameState = "bodySearch";
    caseDetails["victim"] = victimList;
    caseDetails["timeOfDeath"] = dayManager.getTime();
    caseDetails["timeOfDeathDisplay"] = killer.weapon.isNoisy ? dayManager.getTime() : dayManager.currentPeriod;
    caseDetails["crimeScene"] = victimList.length === 2 ? [victimList[0].location, victimList[1].location] : [victimList[0].location];
    caseDetails["murderWeapon"] = killer.weapon;

}

export function advanceTime() {
    dayManager.passTheTime();
    if (GameManager.gameState !== "bodySearch") {
        if (dayManager.getTime() === "12:00 am") {
            dayManager.skipToMorning();
            textQueue.pushIntoQueue(uiModel.endOfDay(dayManager.currentDay - 1));
            return true;
        }
    }
    return false;

}

//returns the average mood of a given list of people 
function getAvgMood(characterList) {
    let moodSum = 0;
    let totalPeople = characterList.length;
    for (const person of characterList) {
        if (person.isAlive) moodSum += person.moodLevel;
    }

    return moodSum / totalPeople;
}

function updateGroupMood(averageMood, characterList) {
    for (const char of characterList) {
        if (char === player) continue;
        if (averageMood > char.moodLevel) char.moodSwing(averageMood * 0.5);
        else if (averageMood < char.moodLevel) char.moodSwing(averageMood * -0.5);
    }
}

export function updateTextDisplay() {
    if (!textQueue.isQueueEmpty()) textQueue.updateStoryMessage();
    else displayNothing();
}


map.setIsActive(false);



export function createPlayer() {
    if (!playerInput.value) return;

    player.charName = playerInput.value;
    GameManager.setGameStart();
}

export function submitSuspect(suspect) {
    if (suspect === killer.charName) {
        if (killer.isAlive) textQueue.pushIntoQueue(uiModel.correctSuspectChosen(suspect));
        else textQueue.pushIntoQueue(uiModel.correctSuspectSuicide(suspect));
        removeVictimsAndKiller(caseDetails["victim"], killer);

    } else if (caseDetails["victim"].map(victim => victim.charName).includes(suspect)) {
        textQueue.pushIntoQueue(uiModel.wrongSuspectVictim(suspect, killer.charName));

    } else {
        if (caseDetails["victim"].map(victim => victim.charName).includes(killer.charName))
            textQueue.pushIntoQueue(uiModel.wrongSuspectSuicide(suspect, killer.charName))
        else textQueue.pushIntoQueue(uiModel.wrongSuspectChosen(suspect, killer.charName));
    }
    updateTextDisplay();
}

function removeVictimsAndKiller(victimList, killer) {
    characterList.splice(characterList.indexOf(killer), 1);
    victimList.forEach(victim => {
        characterList.splice(characterList.indexOf(victim), 1);
    });
    const namesToRemove = victimList.map(victim => victim.charName);
    namesToRemove.push(killer.charName);
    removeRadioButtons(namesToRemove);

}







