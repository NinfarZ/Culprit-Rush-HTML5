import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations, hideWeapons } from "./location.js";
import { typeOut, textQueue } from "./uiData.js";
import { map } from "./map.js";
import { dayManager } from "./dayManager.js";
import Character from "./character.js";
import Killer from "./killer.js";
import * as uiModel from "./uiOrganizer.js";



export const player = new Player("You", true, "M", locations.MyBedroom, [], [], 0.5);
const sarah = new Character("Sarah", true, "F", locations.Cafeteria, [], [], 0.5);
const james = new Character("James", true, "M", locations.Cafeteria, [], [], 0.3);
const steve = new Character("Steve", true, "M", locations.Cafeteria, [], [], 0.5);
const linda = new Character("Linda", true, "F", locations.Cafeteria, [], [], 0.5);
const laela = new Character("Laela", true, "F", locations.Cafeteria, [], [], 0.7);
const makoto = new Character("Makoto", true, "M", locations.Cafeteria, [], [], 0.5);

export let characterList = [sarah, james, steve, linda, laela, makoto];

const chooseKiller = characterList.splice(Math.floor(Math.random() * characterList.length), 1);
const killerValues = Object.values(chooseKiller[0]);
export const killer = new Killer(killerValues[0], killerValues[1], killerValues[2], killerValues[3], killerValues[4], killerValues[5], killerValues[6], null, null);
characterList.push(killer);

export let GameManager = {
    setGameStart: function () {
        for (const char of characterList) {
            char.randomizeLocation();
        }
        map.setIsActive(false);
        hideWeapons()
        textQueue.pushIntoQueue(uiModel.introText());
        textQueue.pushIntoQueue(uiModel.mapTutorialText());

        if (!textQueue.isQueueEmpty()) textQueue.updateStoryMessage();


    },
    tutorialPhase: function () {
        map.setIsActive(true);
        dayManager.passTheTime();

        for (const char of characterList) {
            char.turn()
        }

    },
    turn: function () {
        dayManager.passTheTime();
        if (dayManager.getTime() === "12:00 am") dayManager.skipToMorning();

        for (const char of characterList) {
            char.turn()
        }

        let whosInsideRoom = [...player.location.whosInside];
        whosInsideRoom.splice(whosInsideRoom.indexOf(player), 1);
        console.log(whosInsideRoom);

        //probability of characters showing behaviour
        const chanceOfEvent = 38;
        if (Math.floor(Math.random() * 100) <= chanceOfEvent) {
            if (whosInsideRoom.length === 1) textQueue.pushIntoQueue(uiModel.behaviourSolo(whosInsideRoom));
            if (whosInsideRoom.length > 1) textQueue.pushIntoQueue(uiModel.behaviourGroup(whosInsideRoom));

            const averageMood = getAvgMoodInRoom(whosInsideRoom);
            updateGroupMood(averageMood);

        }


        if (!textQueue.isQueueEmpty()) textQueue.updateStoryMessage();





    }
}

//returns the average of everyone's mood whithin a room
function getAvgMoodInRoom(whosInsideRoom) {
    let moodSum = 0;
    let totalPeople = whosInsideRoom.length;
    for (const person of whosInsideRoom) {
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

const mainInfoDisplay = document.createElement("DIV");

map.setIsActive(false);



export function createPlayer() {
    if (!playerInput.value) return;

    player.charName = playerInput.value;
    GameManager.setGameStart();
}




