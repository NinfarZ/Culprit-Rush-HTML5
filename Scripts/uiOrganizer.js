import { characterList, killer, player } from "./gameManager.js";


const introText = () => ["Welcome and greetings.", `You're trapped inside a mysterious building with ${characterList.length} other people.`, `${listCharacters(characterList)}.`,
    `One of them is dangerous. And will attack at a moment's notice.`,
    `The killer can ONLY attack when in a bad mood.`, `Keep that in mind.`];
const mapTutorialText = () => [`Use the map interface below to move around.`,
    `Every move you make spends a turn.`,
    `On each turn, time will pass, and everyone will perform an action.`,
    `So watch out.`,
    `The culprit is on the move...`];
const killingSound = (bodyLocation) => [`A loud violent noise echoed through the building.`, `You should check the ${bodyLocation.name}...`];
const bodyDiscovery = (bodyLocation, victimList) => [`You step into the ${bodyLocation.name}. There, laying cold on the floor, you see ${listCharacters(victimList)}.`];
const bodyDiscoveryNotOver = (bodyLocation) => [`And that's not all. You should check the ${bodyLocation.name}...`];
const bodyInvestigationIntro = (victimList) => [`It has happened.`, `Now begins the moment of truth.`, `You have 1 day to unveil the culprit.`, `If you don't, it's game over.`, `Who killed ${listCharacters(victimList)}?`, `Talk to the others.`, `Listen to their testemonies and reach the truth.`, `Submit your answer bellow on who did it.`, `You only have ONE chance.`]
const endOfDay = (day) => [`End of day ${day}. Everyone went back to their rooms for the night.`];

const behaviourSolo = (peopleInside) => [`${pickRandomPerson(peopleInside).charName}'s ${pickLocationBehaviour()} while ${pickSoloMoodBehaviour(peopleInside[0])}.`];
const behaviourGroup = (peopleInside) => [pickGroupMoodBehaviour(peopleInside)];

export const playerFindsWeapon = (item, location) => [`You found a ${item} in the ${location}!`];
export const playerWeaponMissing = (item, location) => [`Uh Oh. The ${item} is missing from the ${location}...`];
export const playerBodyInvestigation = (murderWeapon, timeOfDeath) => [`The victim was killed around ${timeOfDeath}. The murder weapon was a ${murderWeapon.weaponName}.`];

//character intel. Info is taken out of each char investigation reports
export const seenCharAdjecentRoom = (charName, peopleInside, locationName, time) => [`${charName}: "I saw ${listCharacters(peopleInside)} walking into the ${locationName} at ${time}."`];
export const seenWeapon = (charName, weaponName, locationName, time) => [`${charName}: "I saw a ${weaponName} in the ${locationName} at ${time}."`];
export const alibi = (charName, locationName, peopleInside, time) => [`${charName}: "I was with ${listCharacters(peopleInside)} in the ${locationName} at ${time}."`];

const correctSuspectChosen = (killerName) => [`. . .`, `Good job.`, `The culprit was indeed ${killerName}.`];
const wrongSuspectChosen = (guessName, killerName) => [`. . .`, `Good job.`, `But you are wrong...`, `The culprit wasn't ${guessName}.`, `It was ${killerName}.`];
const wrongSuspectVictim = (guessName, killerName) => [`. . .`, `Hmmm.`, `${guessName} was a victim were they not?`, `Are you saying it was suicide?`, `Well, it wasn't.`, `The culprit was ${killerName}.`];

const interactionBehaviours = {
    "friendly": [`comforting`, `laughing with`, `telling a joke to`, `hugging`, `complimenting`, `shaking hands with`, `eating a snack with`, `brofisting`],
    "casual": [`focused on`, `chatting with`, `discussing an escape plan with`, `sharing clues with`],
    "angry": [`ignoring`, `frowning at`, `annoyed at`, `cursing at`, `accusing`, `running after`, `threatning`, `spitting on`, `flipping off`],
}

const soloBehaviours = {
    "friendly": [`humming to a tune`, `dancing`, `smilling at you`, `waving at you`, `telling you a funny story`, `saying you look nice`],
    "casual": [`yawning`, `deep in thought`, `staring off into the distance`, `trying not to fall asleep`, `stretching`, `looking at you`, `letting out a sigh`, `asking you for clues`],
    "angry": [`throwing an object in frustration`, `shaking their head in disbelief`, `stomping their foot on the ground in anger`, `barking like a dog`, `glaring at you`, `telling you to leave`, `punching the wall`, `blaming you for everything`]
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
    const charMood = getCharMood(peopleInside);
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
        return `${speaker.charName}'s ${pickLocationBehaviour()} and ${behaviourSpeaker} ${listener.charName}.`;
    } else {
        const behaviourListener = soloBehaviours[listenerMood][Math.floor(Math.random() * soloBehaviours[listenerMood].length)];
        return `${speaker.charName}'s ${pickLocationBehaviour()} and ${behaviourSpeaker} ${listener.charName}.`;
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

export {
    introText, mapTutorialText, behaviourSolo, behaviourGroup, killingSound, bodyDiscovery,
    bodyDiscoveryNotOver, bodyInvestigationIntro, endOfDay, wrongSuspectChosen, correctSuspectChosen, wrongSuspectVictim
};

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