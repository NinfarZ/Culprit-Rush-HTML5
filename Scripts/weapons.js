
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


class WeaponClass {
    constructor(itemType, weaponClass) {
        this.itemType = itemType;
        this.weaponClass = weaponClass;
    }
}

class Weapon extends WeaponClass {
    constructor(weaponName, isNoisy, itemType, weaponClass) {
        super(itemType, weaponClass);
        this.weaponName;
        this.isNoisy;
    }

}

const knife = new Weapon("Knife", false, "weapon", weaponClassObj.melee);
const gun = new Weapon("Gun", true, "weapon", weaponClassObj.ranged);
const poison = new Weapon("Poison", false, "weapon", weaponClassObj.trap);
export const weapons = { knife, gun, poison };
console.log(weapons)


