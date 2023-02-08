import { characterList, killer, player } from "./gameManager.js";


const introText = () => ["Welcome and greetings.", `You're trapped inside a mysterious building with ${characterList.length} other people.`, `${listCharacters(characterList)}.`,
    `One of them is dangerous. And are likely to attack if in a bad mood.`,
    `Uncover the culprit and escape.`];
const mapTutorialText = () => [`Use the map interface below to move around.`,
    `Every move you make spends a turn.`,
    `On each turn, time will pass, and everyone will perform an action.`,
    `So watch out.`,
    `The culprit is on the move...`];
const killingSound = (bodyLocation) => [`A loud violent noise echoed through the building.`, `It came from the ${bodyLocation.name}...`];
const bodyDiscovery = (bodyLocation, victim) => [`You step into the ${bodyLocation.name}. There, laying cold on the floor, you see ${victim.charName}.`]
const bodyInvestigationIntro = (victim) => [`It has happened.`, `Now begins the moment of truth.`, `You have 3 days to unveil the culprit.`, `If you don't, it's game over.`, `Who killed ${victim.charName}?`, `Talk to the others.`, `Listen to their testemonies and reach the truth.`]
const endOfDay = (day) => [`End of day ${day}. Everyone went back to their rooms for the night.`];

const behaviourSolo = (peopleInside) => [`${pickRandomPerson(peopleInside).charName}'s ${pickLocationBehaviour()} while ${pickSoloMoodBehaviour(peopleInside)}.`];
const behaviourGroup = (peopleInside) => [pickGroupMoodBehaviour(peopleInside)];

export const playerFindsWeapon = (item, location) => [`Uh Oh. There's a [ ${item} ] in the ${location}!`];
export const playerBodyInvestigation = (murderWeapon, timeOfDeath) => [`The victim was killed around ${timeOfDeath}. The murder weapon was a ${murderWeapon.weaponName}.`];

const interactionBehaviours = {
    "friendly": [`comforting`, `laughing with`, `telling a joke to`, `hugging`, `complimenting`, `shaking hands with`, `eating a snack with`, `brofisting`],
    "casual": [`trying to make sense of`, `trying to make small talk with`, `discussing an escape plan with`, `sharing clues about the culprit with`],
    "angry": [`ignoring`, `frowning at`, `annoyed at`, `cursing at`, `accusing`, `running after`, `threatning`, `slapping`, `spitting at`],
}

const soloBehaviours = {
    "friendly": [`humming to a tune`, `dancing`, `smilling at you`, `waving at you`, `telling you a funny story`, `saying you look nice today`],
    "casual": [`yawning`, `deep in thought`, `staring off into the distance`, `trying not to fall asleep`, `stretching`, `looking at you`, `wondering who the culprit is`, `pondering about what to do`],
    "angry": [`throwing an object in frustration`, `shaking their head in disbelief`, `stomping their foot on the ground in anger`, `growling`, `glaring at you`, `telling you to leave them alone`, `hitting their head on the wall`, `blaming you for everything`]
}

const locationBehaviours = {
    "Cafeteria": [`eating something`, `walking in circles around the dining table`, `carrying a chair`],
    "Classroom": [`writing something on the blackboard`, `sitting at a desk reading a random book`],
    "Bathroom M": [`walking into a stall`, `washing their hands`, `taking a shower`, `changing their clothes`, `standing at the urinol`],
    "Bathroom F": [`walking into a stall`, `washing their hands`, `taking a shower`, `changing their clothes`],
    "Corridor": [`sitting against the wall`, `standing around`, `walking along the corridor`],
    "Corridor 2": [`standing against the wall`, `pointing at the pub`, `looking at the other end of the corridor`],
    "Kitchen": [`trying to cook`, `cooking`, `looking for food`, `accidentaly setting the kitchen on fire`, `pulling a soggy sandwich out of the fridge`],
    "Pub": [`laying on the couch`, `drinking a random cocktail`, `making a suspicious cocktail`, `spilling vodka everywhere`]
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
    const speakerMood = getCharMood(speaker);
    const listenerMood = getCharMood(listener);
    const speakerGender = speaker.gender == "F" ? "her" : "him";
    const listenerGender = listener.gender == "F" ? "she" : "he";
    const behaviourSpeaker = interactionBehaviours[speakerMood][Math.floor(Math.random() * interactionBehaviours[speakerMood].length)];
    if (speakerMood === listenerMood) {
        const behaviourListener = interactionBehaviours[listenerMood][Math.floor(Math.random() * interactionBehaviours[listenerMood].length)];
        return `${speaker.charName}'s ${pickLocationBehaviour()} and ${behaviourSpeaker} ${listener.charName}, while ${listenerGender}'s ${behaviourListener} ${speakerGender}.`;
    } else {
        const behaviourListener = soloBehaviours[listenerMood][Math.floor(Math.random() * soloBehaviours[listenerMood].length)];
        return `${speaker.charName}'s ${pickLocationBehaviour()} and ${behaviourSpeaker} ${listener.charName}, while ${listenerGender}'s ${behaviourListener}.`;
    }


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

export { introText, mapTutorialText, behaviourSolo, behaviourGroup, killingSound, bodyDiscovery, bodyInvestigationIntro, endOfDay };

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