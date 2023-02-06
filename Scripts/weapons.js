
let weaponClassObj = {
    melee: {
        canKill(killer, victim) {
            return killer.location === victim.location ? true : false;
        }
    },
    ranged: {
        canKill(killer, victim) {
            if (killer.location.adjecentRooms().includes(victim.location)) return true;
            return false;
        }
    },
    trap: {
        canKill(killer, victim) {
            return killer.location !== victim.location ? true : false;
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

}

const knife = new Weapon("Knife", false, "weapon", weaponClassObj.melee);
const gun = new Weapon("Gun", true, "weapon", weaponClassObj.ranged);
const poison = new Weapon("Poison", false, "weapon", weaponClassObj.trap);
export const weapons = { knife, gun, poison };
console.log(weapons)


