#pragma strict

class Inventory extends MonoBehaviour {

	var av:Player;
	var weapons:Array = [];
	var equiped:int = 0;

    function init(av:Player):void {
        //record Player
        this.av = av;
        
        //add 3 random weapons to the inventory weapon list
        for (var n:int = 1; n <= 3; n++) { 
        	weapons.push(createRandomWeapon()); 
        }
        
        //equip first weapon by default
        equipWeapon(0);
    }
    
    
    //choose a random weapon from the list
    
    public static function createRandomWeapon():Weapon  {
    
    	// get type arrays
    	var melee:Array = 
    	["Empty", "BattleAxe", "BattleHammer", "OrcAxe", "OrcBlueSword","OrcRedSword","Scimitar", "ZeldaRazor","ZeldaShield"];
		var guns:Array = 
		["DesertHawk", "Handgun", "LowGun", "MicroUzi", "P99","PistolAuto","PistolSemi", "Revolver"];
		var rifles:Array = 
		["M1Garand", "Dragunov", "PSG1", "Shotgun", "SPAS12",
        "MP5","MP5Mod",
        "AK47", "M16", "R1", "SIG552", "TommyGunMod",
        "RPG"];
        
        // get one of the above arrays at random
        var types:Array = [melee, guns, rifles];
        var randomWeapons:Array = types[Random.Range(0,types.length)]; // types[0];
        
        // get random weapon from type array
        var id:String = randomWeapons[Random.Range(0, randomWeapons.length)];
        var weapon:Weapon = new Weapon(id);
        
        // return random weapon
        return weapon;
    }
    
    
    //equip given weapon num
    
    public function equipWeapon(num:int):void {
        //destroy previous equiped weapon gameobject
        //if (av.weapon != null) { Destroy(av.weapon.go); }
        
        //get new weapon object
        var weapon:Weapon = weapons[num];
        
        //create new weapon gameobject
        //print("prefabs/weapons/" + weapon.type + "/" + weapon.id + "/_" + weapon.id);
        var go:GameObject = Instantiate(Resources.Load(
        "prefabs/weapons/" + weapon.type + "/" + weapon.id + "/_" + weapon.id), Vector3.zero, av.gun.rotation); 
        go.transform.parent = av.gun; 
        go.transform.localPosition = Vector3.zero;
        
        //record gameobject and entity in weapon object
        weapon.go = go;
        weapon.entity=weapon.go.AddComponent("Entity") as Entity;
        
        //optimize weapon mesh (except if weapon is _None)
        var meshFilter:MeshFilter = go.GetComponentInChildren(typeof(MeshFilter)) as MeshFilter;
        if (meshFilter) {
            var mesh:Mesh = meshFilter.mesh;
            mesh.Optimize();
        }

        //record vars in Player
        av.weapon = weapon;
        av.cannon = go.transform.Find("_Cannon") as Transform;
        av.line = (av.cannon.Find("_Line") as Transform).gameObject.GetComponent("LineRenderer") as LineRenderer; //LineRenderer 
        av.line.gameObject.SetActive(false);
        //line.SetColors(av.squad.color, av.squad.color); 
        //equip weapon animation
        //if (anim) { StartCoroutine(Anim.Reload(av, .4f)); }
        //record equiped weapon num
        av.inventory.equiped = num;
        //if targeting update apCost 
        //if (av.target) { av.GetApCost(false); }

    }
    
    
    

}