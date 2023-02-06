import { killer, player } from "./gameManager.js";


const introText = () => ["Welcome.", "You're trapped inside a mysterious building with 10 other people.",
    `One of them is dangerous. And will attack at a moment's notice.`,
    `You must uncover the culprit to escape.`];
const mapTutorialText = () => [`Use the map interface below to move around.`,
    `Keep in mind that every move you make spends a turn.`,
    `On each turn, time will pass, and everyone will perform an action.`,
    `So watch out.`,
    `The culprit is on the move...`];

const findingPeopleExploring = () => [`${listCharacters(player.location.whosInside)} ${player.location.whosInside.length > 1 ? "are" : "is"} in the ${player.location.name}`];
const behaviourInTheRoom = () => [`${player.location.whosInside.length > 1 ? "They are" : `${player.location.whosInside[0].gender} is`} ${pickRandomBehaviour(interactionBehaviours.interactionCasual())}`];

const interactionBehaviours = {
    interactionFriendly: () => [`smiling at`, `laughing with`, `telling a joke to`, `hugging`],
    interactionCasual: () => [`talking to`, `looking at`, `talking about what to do with`],
    interactionAngry: () => [`ignoring`, `frowning at`, `annoyed at`, `cursing at`],
}

const locationBehaviours = {
    "Cafeteria": () => [`eating something`, `walking in circles around the dining table`],
    "Classroom": () => [`writing something on the blackboard`],
    "Bathroom": () => [`washing their hands`, `in the stall`],
    "kitchen": () => [`trying to cook`, `cooking`, `looking for food`],
    "Pub": () => [`laying on the couch`, `drinking something`]
}

function pickRandomBehaviour(behaviourArray) {
    const behaviour = behaviourArray[Math.floor(Math.random() * behaviourArray.length)];
    return behaviour;
}



const killerFoundWeapon = () => [`The killer is ${killer.charName} and ${killer.gender === "F" ? "she" : "he"} found the ${killer.weapon}`];

export { introText, mapTutorialText, findingPeopleExploring, killerFoundWeapon, behaviourInTheRoom };

function listCharacters(characterList) {
    characterList.splice(0, 1);
    let namesString = " ";
    if (characterList.length === 1) {
        namesString = characterList[0].charName;
        return namesString;
    }
    for (let i = 0; i < characterList.length; i++) {
        if (i === characterList.length - 1) {
            namesString = namesString + " and " + characterList[i].charName;
        } else {
            namesString += characterList[i].charName + ", ";
        }

    }
    return namesString;
}