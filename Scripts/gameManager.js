import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations, hideWeapons } from "./location.js";
import { textQueue, displayNothing } from "./uiData.js";
import { map } from "./map.js";
import { dayManager } from "./dayManager.js";
import Character from "./character.js";
import Killer from "./killer.js";
import * as uiModel from "./uiOrganizer.js";



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

        //first every character moves rooms and only then investigate
        for (const char of characterList) {
            char.turn()
        }

        for (const char of characterList) {
            if (!Object.keys(caseDetails).length) char.investigate();
        }

        for (const location of Object.values(locations)) {
            const averageMood = getAvgMood(location.whosInside);
            updateGroupMood(averageMood, location.whosInside);
        }

        if (player.location.whosInside.length >= 1) charRoomBehaviour();

        if (Object.keys(caseDetails).length !== 0) {
            if (caseDetails["murderWeapon"].isNoisy) {
                textQueue.pushIntoQueue(uiModel.killingSound(caseDetails["victim"].location));

            }
        }

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
            caseDetails["bodyFound"] = true;
            this.gameState = "murderInvestigation";
        }

        updateTextDisplay();

    },

    "murderInvestigation": function () {
        console.log("it's time to investigate the truth");
        for (const char of characterList) {
            char.turn()
        }

        //map.displayWhosThere();

        updateTextDisplay();
    }
}

export function charRoomBehaviour() {

    const whosInsideRoom = [...player.location.whosInside];
    whosInsideRoom.splice(whosInsideRoom.indexOf(player), 1);

    if (whosInsideRoom.length === 1) textQueue.pushIntoQueue(uiModel.behaviourSolo(whosInsideRoom));
    if (whosInsideRoom.length > 1) textQueue.pushIntoQueue(uiModel.behaviourGroup(whosInsideRoom));
}


export function onCharKilled(victim) {
    GameManager.gameState = "bodySearch";
    caseDetails["victim"] = victim;
    caseDetails["timeOfDeath"] = dayManager.getTime();
    caseDetails["crimeScene"] = victim.location;
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
        moodSum += person.moodLevel;
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


const mainInfoDisplay = document.createElement("DIV");

map.setIsActive(false);



export function createPlayer() {
    if (!playerInput.value) return;

    player.charName = playerInput.value;
    GameManager.setGameStart();
}




