#pragma strict

/*
- Random terrain generator
- Random name generator
- Isometric camera
- Tests in iphone

- Players with melee weapons have to walk first to the target, then attack -> OK
- Create Team class to manage players of the same team -> OK
- LocateTeam: choose N adjacent free cells int the map -> OK
- Players must mark their current cell as unwalkable -> OK
- Player must be selectable by clicking on them, enemies targetable -> OK!


******* Players *******

- get walkability of next cell every time we are going to move to the next cell in path

- pickup action: equip and unequip item or exchange it for item on cell

- implement throwable object (grenade), to throw current item to selected cell

- Jump from cell to cell
	- calculate jumpDistance
	- if in range, describe a parabola to selected cell
	- and trigger a jump animation, which should interpolate a jump gesture to the duration of the jump


******* Planets *******

- Planet object
	- pre-generate 3 diferent planets
	- create a planet switcher (space trip)
	
- Spaceship Vehicle object
	- 4 players must sit into it

- Mission object
	- each planet has a mission
		- mission has some rules to acomplish
		- you get a reward when doing it
	- each planet has a new mission point -> same or another planet

******* Terrain *******

- create water at a water altitude
- create grass
- create trees
- create vegetation

	
*/

class World extends MonoBehaviour {

	public static var world:World;
	public static var cam: CameraOrbit;
	public static var terrain: TerrainGenerator;
	public var sun:Sun;
	
	public static var av: Player;
	public static var team:Team;
	public static var teams:Array = [];
	public static var bullets:Array = [];
	public static var obstaclesArr:Array = [];
	public static var weaponsArr:Array = [];
	
	public static var temp:GameObject;
	public static var obstacles:GameObject;
	public static var trees:GameObject;
	
	var size = Vector2(32, 32);
	var maxCubes = 8;
	var maxTrees = 8;
	

	function Start () {
		world = this;
		init();   	
	}
	

	// Create
	
	function init(): void  {
		// init temp game object, where all temporary objects will be created
		temp = GameObject.Find('Temp');
		 
		// init terrain
		terrain = GameObject.Find('Terrain').GetComponent('TerrainGenerator') as TerrainGenerator; 
        terrain.init(size.x, size.y);
        
        // init abstract grid with astar
        Grid.InitEmpty(terrain.width, terrain.height);
        
        // init Obstacles
        obstacles = GameObject.Find('obstacles');
        
        initObstacles();
        addObstacles ('cube', 'prefabs/world/Cube', maxCubes);
        addObstacles ('tree', 'prefabs/trees/Palm/Palm', maxTrees);
        terrain.combineMesh(obstacles);
        
        // update mesh collider
//        var mesh:Mesh = obstacles.transform.GetComponent(MeshFilter).mesh;
//		var mc:MeshCollider = obstacles.GetComponent('MeshCollider') as MeshCollider;
//	    if(mc) {
//	    	mc.sharedMesh = null;
//			mc.sharedMesh = mesh;	
//		} else {
//			obstacles.AddComponent('MeshCollider');
//			mc.sharedMesh = mesh;	
//		}

        // init sun
        sun = GameObject.Find('Sun').GetComponent('Sun') as Sun;
        sun.init();
        
        // init camera
        cam = GameObject.Find('Camera').GetComponent('CameraOrbit') as CameraOrbit;

		// init teams
		var team1:Team = createTeam('The Hunters', new Color(Random.value, Random.value, Random.value));
		var team2:Team = createTeam('Shapeshifters', new Color(Random.value, Random.value, Random.value));
		team1.select();

        // init game controls (mouse and keys)
        var controls:Controls  = gameObject.AddComponent('Controls') as Controls;  
	}
	
	
	// Reset
	
	public function reset(): void {
		// generate new terrain
		World.terrain.initRandomTerrain();
		
		Grid.InitEmpty(terrain.width, terrain.height);
		
		// generate obstacles
		initObstacles();
        addObstacles ('cube', 'prefabs/world/Cube', maxCubes);
        addObstacles ('tree', 'prefabs/trees/Palm/Palm', maxTrees);
		terrain.combineMesh(obstacles);
		
		// update mesh collider
//		var mesh:Mesh = obstacles.transform.GetComponent(MeshFilter).mesh;
//		var mc:MeshCollider = obstacles.GetComponent('MeshCollider') as MeshCollider;
//	    if(mc) {
//	    	mc.sharedMesh = null;
//			mc.sharedMesh = mesh;	
//		} else {
//			obstacles.AddComponent('MeshCollider');
//			mc.sharedMesh = mesh;	
//		}

		// destroy previous teams
		for (var i:int = 0; i < teams.length; i++) {
			var team:Team = teams[i];
			team.destroy();
		}
		teams = [];
		av = null;

		// init teams
		var team1:Team = createTeam('The Hunters', new Color(Random.value, Random.value, Random.value));
		var team2:Team = createTeam('Shapeshifters', new Color(Random.value, Random.value, Random.value));
		team1.select();
	}
	
	
	// Obstacles
	
	static function initObstacles (): void {
		
		
		// destroy previous obstacles
		for (var i:int = 0; i < obstaclesArr.length; i++) {
			var me:Obstacle = obstaclesArr[i];
			me.destroy();
			me = null;
		}
		obstaclesArr = [];
		
		Destroy(obstacles);	
		obstacles = Instantiate(Resources.Load('prefabs/world/Obstacles'), Vector3.zero, Quaternion.identity) as GameObject;
		obstacles.name = 'obstacles';
		obstacles.transform.parent = terrain.transform;
		obstacles.layer = LayerMask.NameToLayer('Default');
		//obstacles.layer = LayerMask.NameToLayer('Terrain');	
	}
	
	
	static function addObstacles (type:String, path:String, max:int): void {
		// generate new obstacles
		for (var i:int = 0; i < max; i++) {
			var obj:GameObject = Instantiate(Resources.Load(path), Vector3.zero, Quaternion.identity) as GameObject;

	    	var me:Obstacle = obj.AddComponent("Obstacle") as Obstacle;
	    	me.init(obstacles.transform, 'Default', i, type + '_' + i, Vector3(1, 1, 1)); 
        	me.position = me.locate(me.getRandomPosition(1)); // Vector2(0.5,0.5));
        	Grid.setWalkable(me.position.x, me.position.z, false);	
        	
        	
        	// adjust by obstacle type
        	switch (type) {
    		case 'cube':
    			World.terrain.makeCube(obj, 1);
    			terrain.adjustCube(obj, Random.Range(1, 3));
    			break;
    		case 'tree':
    			var sc = Random.Range(0.1, 0.3);
				obj.transform.localScale = Vector3(sc, sc, sc);
				obj.transform.position.y += Random.Range(-1.5, -0.5);//Random.Range(-2, -0.5);
				obj.transform.Rotate(0, Random.Range(0, 360), 0);
    			break;
        	}
        	
        	//if(type == 'cube') {
        	Grid.setCellType('obstacle', me.position.x, me.position.z);
        	//}
        	//var cell:Cell = Grid.getCell(me.position.x, me.position.z);
        	//cell.type = 'obstacle';
    		//print (name + ' at pos ' + cell.x + ' ' + cell.z + ' ' + cell.type);

	    	obstaclesArr.push(me);
		}
	}
	
	
	// Teams
	
	function createTeam (name: String, color:Color): Team {
		var obj:GameObject = new GameObject("Team");
		var me:Team = obj.AddComponent("Team") as Team;
		
		var pos:Vector2 = Vector2(Random.Range(2, World.terrain.width - 3), Random.Range(2, World.terrain.height - 3));
		me.init(transform, teams.length, name, pos, color); 

		teams.push(me);
		return me;
	}
	

    static function selectNextTeam(): void {
    	var num = World.team.num + 1;
    	if (num == World.teams.length) { num = 0; }
    	var temp:Team = World.teams[num];
    	temp.select();
    }
    
    

	
	// Weapons
	
//	public function createWeapons(max:int):void {
//        var weapon:Weapon;
//	
//		// destroy previous obstacles
//		for(var i:int = 0; i < weaponsArr.length; i++) {
//			weapon = weaponsArr[i];
//			Destroy(weapon.go);
//			//weapon.destroy();
//			weapon = null;
//		}
//		
//		// generate new obstacles
//		weaponsArr = [];
//		for (i = 0; i < max; i++) {
//	        //create a new random weapon object
//	        weapon = Inventory.createRandomWeapon();
//	        
//	        //create new weapon gameobject
//	        //print("prefabs/weapons/" + weapon.type + "/" + weapon.id + "/_" + weapon.id);
//	        var go:GameObject = Instantiate(Resources.Load(
//	        "prefabs/weapons/" + weapon.type + "/" + weapon.id + "/_" + weapon.id), Vector3.zero, av.gun.rotation); 
//	        go.transform.parent = transform; 
//	        go.layer = LayerMask.NameToLayer('Terrain');
//	        //go.transform.localPosition = Vector3.zero;
//	        
//	        // set random rotation
//	        weapon.rot = Random.Range(-10, 10);
//	        
//	        //record gameobject and entity in weapon object
//	        weapon.go = go;
//	        weapon.entity = weapon.go.AddComponent("Entity") as Entity;
//	        
//	        //optimize weapon mesh (except if weapon is _None)
//	        var meshFilter:MeshFilter = go.GetComponentInChildren(typeof(MeshFilter)) as MeshFilter;
//	        if (meshFilter) {
//	            var mesh:Mesh = meshFilter.mesh;
//	            mesh.Optimize();
//	        }
//	        
//	        // locate weapon at random position on terrain
//	        weapon.entity.position = weapon.entity.locate(weapon.entity.getRandomPosition(1)); 
//	        go.transform.localPosition += Vector3(0, 0.3, 0);
//	        
//	        // add weapon to weapons array
//	        print(weapon + ' ' + go); 
//	        weaponsArr.push(weapon);
//        }
//
//    }
	
	
	

	
	// Update
	
//	function Update() {
//		for(var i:int = 0; i < weaponsArr.length; i++) {
//			var weapon:Weapon = weaponsArr[i];
//			if (weapon) {
//				var r:float = weapon.rot;
//				weapon.go.transform.Rotate(r,r,0);
//			}
//		}
//	}

}
