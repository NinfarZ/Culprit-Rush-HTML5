import Player from "./player.js";
//import { disableButtonEvent, uiData } from "./uiData.js";
import { locations, hideWeapons } from "./location.js";
import { typeOut, textQueue } from "./uiData.js";
import { map } from "./map.js";
import { dayManager } from "./dayManager.js";
import Character from "./character.js";
import Killer from "./killer.js";
import * as uiModel from "./uiOrganizer.js";



export const player = new Player("You", true, "M", locations.MyBedroom, [], []);
const john = new Character("John", true, "M", locations.Cafeteria, [], []);
const jeff = new Character("Jeff", true, "M", locations.Cafeteria, [], []);
const maria = new Character("Maria", true, "F", locations.Cafeteria, [], []);
const sarah = new Character("Sarah", true, "F", locations.Cafeteria, [], []);
const james = new Character("James", true, "M", locations.Cafeteria, [], []);
const steve = new Character("Steve", true, "M", locations.Cafeteria, [], []);
const linda = new Character("Linda", true, "F", locations.Cafeteria, [], []);
const laela = new Character("Laela", true, "F", locations.Cafeteria, [], []);
const amy = new Character("Amy", true, "F", locations.Cafeteria, [], []);
const makoto = new Character("Makoto", true, "M", locations.Cafeteria, [], []);

export let characterList = [sarah, james, steve, linda, laela, makoto];

const chooseKiller = characterList.splice(Math.floor(Math.random() * characterList.length), 1);
const killerValues = Object.values(chooseKiller[0]);
export const killer = new Killer(killerValues[0], killerValues[1], killerValues[2], killerValues[3], killerValues[4], killerValues[5], null);
characterList.push(killer);

export let GameManager = {
    setGameStart: function () {
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

        if (whosInsideRoom.length >= 1) {
            textQueue.pushIntoQueue(uiModel.findingPeopleExploring());
            textQueue.pushIntoQueue(uiModel.behaviourInTheRoom());
        }

        console.log(dayManager.getTime());
        if (!textQueue.isQueueEmpty()) textQueue.updateStoryMessage();



    }
}


const mainInfoDisplay = document.createElement("DIV");

map.setIsActive(false);



export function createPlayer() {
    if (!playerInput.value) return;

    player.charName = playerInput.value;
    GameManager.setGameStart();
}




