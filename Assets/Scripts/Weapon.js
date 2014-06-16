#pragma strict

class Weapon {

	var go:GameObject; //reference to the weapon model
    var entity:Entity; //reference to the weapon Entity

    var rot:float; // increment for weapon auto-rotation

    var id:String;
    var type:String;
    var pose:String;
    var wav:String;

    var range:float;
    var accuracy:float;
    var speed:float;
    var recoil:float;
    var weight:float;

    var cost:int;
    var damage:int;
    var ammo:int;
    var ammoMax:int;

    var burstMode:boolean;
    var burstMax:int;
    var burstNum:int = 0;


    function Weapon(id:String) {
    	// set weapon properties by id
        getProps(id);
        // set default properties
        this.id = id;
        ammoMax = ammo;
    }

    function getProps(id:String):void {

        switch (id){

            //Melee
            case "Empty":
                 type = "meleeWeapons"; pose="melee";
                 accuracy = .5f; range = 0f; damage = 2; burstMax=1; speed = .35f; ammo = 0; weight = 0f; wav="swordA";
                 cost = 6;
                break;
            case "BattleAxe":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 7; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 8; pose="melee";
                break;
            case "BattleHammer":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 8; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 9;
                break;
            case "OrcAxe":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 7; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 8;
                break;
            case "OrcRedSword":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 6; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 7;
                break;
            case "OrcBlueSword":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 6; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 7;
                break;
            case "Scimitar":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 6; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 7;
                break;
            case "ZeldaRazor":
                type = "meleeWeapons"; pose="melee";
                accuracy = .5f; range = 0f; damage = 6; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 6;
                break;

            //Shields
            case "ZeldaShield":
                type = "shields"; pose="shield";
                accuracy = .5f; range = 0f; damage = 4; burstMax = 1; speed = .35f; ammo = 0; weight = 0f; wav = "swordA";
                cost = 9;
                break;

            //HandGuns
            case "DesertHawk":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 4; burstMax = 1; speed = .2f; ammo = 7; weight = 0f; recoil = 10f; wav = "shotA";
                cost = 8;
                break;
            case "Handgun":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 4; burstMax=1; speed = .2f; ammo = 7; weight = 0f; recoil = 10f; wav="shotA";
                cost = 8;
                break;
            case "LowGun":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 4; burstMax = 1; speed = .2f; ammo = 7; weight = 0f; recoil = 10f; wav = "shotA";
                cost = 8;
                break;
            case "P99":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 4; burstMax = 1; speed = .2f; ammo = 7; weight = 0f; recoil = 10f; wav = "shotA";
                cost = 8;
                break;
            case "PistolAuto":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 4; burstMax=1; speed = .2f; ammo = 11; weight = 0f; recoil = 10f; wav="shotA";
                cost = 8;
                break;
            case "PistolSemi":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 4; burstMax=1; speed = .2f; ammo = 9; weight = 0f; recoil = 10f; wav="shotA";
                cost = 8;
                break;
            case "Revolver":
                type = "handGuns"; pose="gun";
                accuracy = .5f; range = 6f; damage = 5; burstMax=1; speed = .2f; ammo = 6; weight = 0f; recoil = 10f; wav="shotA";
                cost = 8;
                break;

            //Submachine Guns
            case "MP5":
                type = "subMachineGuns"; pose="rifle";
                accuracy = .5f; range = 8f; damage = 4; burstMax=3; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;
            case "MP5Mod":
                type = "subMachineGuns"; pose="rifle";
                accuracy = .5f; range = 9f; damage = 4; burstMax=3; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;
            case "MicroUzi":
                type = "subMachineGuns"; pose="gun";
                accuracy = .5f; range = 8f; damage = 5; burstMax=5; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;

            //Snipper Rifles
            case "M1Garand":
                type = "snipperRifles"; pose="rifle";
                accuracy = .6f; range = 12f; damage = 5; burstMax = 1; speed = .3f; ammo = 9; weight = 0f; recoil = 2f; wav = "shotA";
                cost = 9;
                break;
            case "Dragunov":
                type = "snipperRifles"; pose="rifle";
                accuracy = .8f; range = 16f; damage = 6; burstMax=1; speed = .3f; ammo = 9; weight = 0f; recoil = 2f; wav="shotA";
                cost = 9;
                break;
            case "PSG1":
                type = "snipperRifles"; pose="rifle";
                accuracy = .8f; range = 16f; damage = 6; burstMax=1; speed = .3f; ammo = 9; weight = 0f; recoil = 2f; wav="shotA";
                cost = 9;
                break;

            //Shotguns
            case "Shotgun":
                type = "shotguns"; pose="rifle";
                accuracy = .4f; range = 5f; damage = 8; burstMax=1; speed = .4f; ammo = 2; weight = 0f; recoil = 2f; wav="shotA";
                cost = 10;
                break;
            case "SPAS12":
                type = "shotguns"; pose="rifle";
                accuracy = .4f; range = 5f; damage = 8; burstMax=1; speed = .4f; ammo = 7; weight = 0f; recoil = 2f; wav="shotA";
                cost = 10;
                break;

            //Assault Rifles
            case "AK47":
                type = "assaultRifles"; pose="rifle";
                accuracy = .5f; range = 11; damage = 6; burstMax=5; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;
            case "M16":
                type = "assaultRifles"; pose="rifle";
                accuracy = .6f; range = 12f; damage = 5; burstMax=5; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;
            case "R1": //ok
                type = "assaultRifles"; pose="rifle";
                accuracy = .5f; range = 11f; damage = 5; burstMax=5; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;
            case "SIG552":
                type = "assaultRifles"; pose="rifle";
                accuracy = .6f; range = 12f; damage = 5; burstMax=5; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav="shotA";
                cost = 8;
                break;
            case "TommyGunMod":
                type = "assaultRifles"; pose="rifle";
                accuracy = .6f; range = 12f; damage = 5; burstMax = 5; speed = .1f; ammo = 16; weight = 0f; recoil = 2f; wav = "shotA";
                cost = 8;
                break;

            //Heavy Weapons
            case "RPG":
                type = "heavyWeapons"; pose="rifle";
                accuracy = .4f; range = 16f; damage = 12; burstMax=1; speed = .5f; ammo = 1; weight = 7f; ; recoil = 2f; wav="shotA";
                cost = 12;
                break;
        }
    }

}