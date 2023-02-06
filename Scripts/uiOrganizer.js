import { characterList, killer, player } from "./gameManager.js";


const introText = () => ["Welcome and greetings.", `You're trapped inside a mysterious building with ${characterList.length} other people.`, `${listCharacters(characterList)}.`,
    `One of them is dangerous. And are likely to attack if in a bad mood.`,
    `Uncover the culprit and escape.`];
const mapTutorialText = () => [`Use the map interface below to move around.`,
    `Every move you make spends a turn.`,
    `On each turn, time will pass, and everyone will perform an action.`,
    `So watch out.`,
    `The culprit is on the move...`];

const findingPeopleExploring = (peopleInside) => [`${listCharacters(peopleInside)} ${peopleInside.length > 1 ? "are" : "is"} in the ${player.location.name}.`];
const behaviourSolo = (peopleInside) => [`${pickRandomPerson(peopleInside).charName} is ${pickSoloMoodBehaviour(peopleInside)} while ${pickLocationBehaviour()}.`];
const behaviourGroup = (peopleInside) => [pickGroupMoodBehaviour(peopleInside) + ` while ${pickLocationBehaviour()}.`];

const interactionBehaviours = {
    "friendly": [`comforting`, `laughing with`, `telling a joke to`, `hugging`],
    "casual": [`talking to`, `questioning`, `discussing an escape plan with`],
    "angry": [`ignoring`, `frowning at`, `annoyed at`, `cursing at`],
}

const soloBehaviours = {
    "friendly": [`humming to a tune`, `dancing`, `smilling at you`, `waving at you`],
    "casual": [`yawning`, `deep in thought`, `staring at the void`, `trying not to fall asleep`, `stretching`, `looking at you`],
    "angry": [`stomping their foot on the ground in anger`, `growling`, `glaring at you`, `telling you to leave them alone`]
}

const locationBehaviours = {
    "Cafeteria": [`eating something`, `walking in circles around the dining table`],
    "Classroom": [`writing something on the blackboard`],
    "Bathroom M": [`hiding in the stall`, `washing their hands`, `taking a shower`],
    "Bathroom F": [`hiding in the stall`, `washing their hands`, `taking a shower`],
    "Corridor": [`sitting against the wall`, `standing around`, `walking along the corridor`],
    "Corridor 2": [`sitting against the wall`, `standing around`, `walking along the corridor`],
    "Kitchen": [`trying to cook`, `cooking`, `looking for food`],
    "Pub": [`laying on the couch`, `drinking something`]
}

function pickSoloMoodBehaviour(peopleInside) {
    const charMood = getCharMood(peopleInside[0]);
    const behaviour = soloBehaviours[charMood][Math.floor(Math.random() * soloBehaviours[charMood].length)];

    return behaviour;
}

function pickGroupMoodBehaviour(group) {
    const people = pickInteractingDuo(group);

    const speaker = people[0];
    const listener = people[1];
    const charMood = getCharMood(speaker);
    const behaviour = interactionBehaviours[charMood][Math.floor(Math.random() * interactionBehaviours[charMood].length)];
    return `${speaker.charName} is ${behaviour} ${listener.charName}`;

}

function getCharMood(character) {

    if (character.moodLevel >= 0.7) return "friendly";

    if (character.moodLevel <= 0.3) return "angry";

    return "casual";
}

function pickInteractingDuo(group) {
    console.log(group);
    const interactingDuo = [];
    const groupAux = [...group];
    const person1 = groupAux.splice(Math.floor(Math.random() * groupAux.length), 1);

    const person2 = groupAux.splice(Math.floor(Math.random() * groupAux.length), 1);


    interactingDuo.push(person1[0], person2[0]);
    console.log(interactingDuo);

    return interactingDuo;
}

function pickLocationBehaviour() {
    const location = player.location.name;
    if (locationBehaviours[location])
        return locationBehaviours[location][Math.floor(Math.random() * locationBehaviours[location].length)];
}

function pickRandomPerson(characterList, index = Math.random() * characterList.length) {
    const randomPerson = characterList[Math.floor(index)];
    return randomPerson;
}

export { introText, mapTutorialText, findingPeopleExploring, behaviourSolo, behaviourGroup };

function listCharacters(characterList) {
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