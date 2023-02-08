import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations, hideWeapons } from "./location.js";
import { textQueue, displayNothing } from "./uiData.js";
import { map } from "./map.js";
import { dayManager } from "./dayManager.js";
import Character from "./character.js";
import Killer from "./killer.js";
import * as uiModel from "./uiOrganizer.js";



export const player = new Player("You", true, "M", locations.MyBedroom, {}, [], 0.5);
const sarah = new Character("Vanessa", true, "F", locations.Cafeteria, {}, [], 0.5);
const james = new Character("James", true, "M", locations.Cafeteria, {}, [], 0.3);
const steve = new Character("Steve", true, "M", locations.Cafeteria, {}, [], 0.5);
const linda = new Character("Wanda", true, "F", locations.Cafeteria, {}, [], 0.5);
const laela = new Character("Laela", true, "F", locations.Cafeteria, {}, [], 0.7);
const makoto = new Character("Makoto", true, "M", locations.Cafeteria, {}, [], 0.5);

export let characterList = [sarah, james, steve, linda, laela, makoto];

const chooseKiller = characterList.splice(Math.floor(Math.random() * characterList.length), 1);
const killerValues = Object.values(chooseKiller[0]);
export const killer = new Killer(killerValues[0], killerValues[1], killerValues[2], killerValues[3], killerValues[4], killerValues[5], killerValues[6], null, null);
characterList.push(killer);

let killingAnnouncement = false;
let bodyFound = false;
export let victim = null;
let timeOfDeath = null;
let murderWeapon = null;

export let caseDetails = {};


export let GameManager = {
    gameState: "turn",
    setGameStart: function () {
        for (const char of characterList) {
            char.randomizeLocation();
            char.startMood();
            console.log(`${char.charName}'s mood is ${char.moodLevel}`)
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

        for (const char of characterList) {
            char.turn()
        }

        if (dayManager.getTime() === "12:00 am") dayManager.skipToMorning();



        if (killer.weapon && !killer.target) {
            if (killer.canSetTarget(getAvgMood(characterList))) killer.lookForTarget(characterList);
        }

        let whosInsideRoom = [...player.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(player), 1);


        //probability of characters showing behaviour
        const chanceOfEvent = 38;
        if (Math.floor(Math.random() * 100) <= chanceOfEvent) {
            if (whosInsideRoom.length === 1) textQueue.pushIntoQueue(uiModel.behaviourSolo(whosInsideRoom));
            if (whosInsideRoom.length > 1) textQueue.pushIntoQueue(uiModel.behaviourGroup(whosInsideRoom));

            const averageMood = getAvgMood(whosInsideRoom);
            updateGroupMood(averageMood);

        }
        map.displayWhosThere();


        updateTextDisplay();
    },

    "bodySearch": function () {

        console.log("it's time to look for the body");


        //characters will move until they find the crime scene
        for (const char of characterList) {
            if (char.location !== caseDetails["victim"].location) char.turn()

        }

        if (player.location === caseDetails["victim"].location) {
            textQueue.pushIntoQueue(uiModel.bodyDiscovery(caseDetails["victim"].location, caseDetails["victim"]));
            textQueue.pushIntoQueue(uiModel.bodyInvestigationIntro(caseDetails["victim"]));
            bodyFound = true;
            this.gameState = "murderInvestigation";
            this.murderInvestigation();
            return;
        }

        //if the weapon makes a loud noise, the player will be alerted
        if (caseDetails["murderWeapon"].isNoisy) {
            if (!killingAnnouncement && !bodyFound) {
                textQueue.pushIntoQueue(uiModel.killingSound(caseDetails["victim"].location));
                killingAnnouncement = true;
            }
        }


        map.displayWhosThere();

        updateTextDisplay();

    },

    "murderInvestigation": function () {
        console.log("it's time to investigate the truth");
        for (const char of characterList) {
            char.turn()
        }

        map.displayWhosThere();

        updateTextDisplay();
    }
}


export function onCharKilled(victim) {
    caseDetails["victim"] = victim;
    caseDetails["timeOfDeath"] = dayManager.getTime();
    caseDetails["murderWeapon"] = killer.weapon;
    GameManager.gameState = "bodySearch";
    GameManager["bodySearch"]();

}

export function advanceTime() {
    dayManager.passTheTime();
    if (!GameManager.gameState === "bodySearch") {
        if (dayManager.getTime() === "12:00 am") {
            dayManager.skipToMorning();
            textQueue.pushIntoQueue(uiModel.endOfDay(dayManager.currentDay));
        }
    }

}

//returns the average mood of a given list of people 
function getAvgMood(characterList) {
    let moodSum = 0;
    let totalPeople = characterList.length;
    for (const person of characterList) {
        moodSum += person.moodLevel;
    }

    return moodSum / totalPeople;
}

function updateGroupMood(averageMood) {
    for (const char of characterList) {
        if (averageMood > char.moodLevel) char.moodSwing(averageMood * 0.5);
        else if (averageMood < char.moodLevel) char.moodSwing(averageMood * -0.5);
    }
}

export function updateTextDisplay() {
    if (!textQueue.isQueueEmpty()) textQueue.updateStoryMessage();
    else displayNothing();
}


const mainInfoDisplay = document.createElement("DIV");

map.setIsActive(false);



export function createPlayer() {
    if (!playerInput.value) return;

    player.charName = playerInput.value;
    GameManager.setGameStart();
}




