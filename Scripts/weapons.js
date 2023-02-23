
let weaponClassObj = {
    melee: {
        className: "MELEE",
        classRules: "The culprit must've been in the SAME ROOM as the victim.",
        canKill(killer, victim) {
            return killer.location === victim.location ? true : false;
        }
    },
    ranged: {
        className: "RANGED",
        classRules: "The culprit was either in the SAME ROOM as the victim or in a room NEXT to the victim.",
        canKill(killer, victim) {
            const killerAdjecentRooms = Object.values(killer.location.adjecentRooms);
            if (killerAdjecentRooms.includes(victim.location) || killer.location === victim.location) return true;
            return false;
        }
    }

}

class Weapon {
    constructor(weaponName, isNoisy, itemType, weaponClass) {
        this.weaponName = weaponName;
        this.isNoisy = isNoisy;
        this.itemType = itemType;
        this.weaponClass = weaponClass;
    }

    canKill(killer, victim) {
        return this.weaponClass.canKill(killer, victim);

    }

    kill(victim) {
        victim.isAlive = false;
        console.log(victim);
    }

    weaponDescription() {
        return `The ${this.weaponName} is of type ${this.weaponClass.className}. To use, ${this.weaponClass.classRules}.`
    }

}

const knife = new Weapon("Knife", false, "weapon", weaponClassObj.melee);
const silentGun = new Weapon("Silent Gun", false, "weapon", weaponClassObj.ranged);
const shotgun = new Weapon("Shotgun", true, "weapon", weaponClassObj.melee);
const gun = new Weapon("Gun", true, "weapon", weaponClassObj.ranged);
export const weapons = [knife, gun, silentGun, shotgun];



