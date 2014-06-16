#pragma strict

import System.Collections.Generic; //  we need this for the astar path:List.<Vector2>

class Player extends Entity {

	// general
	var team:Team;
	var apMode = false;
	var interval:float = 1.5;

	// hud
	var portrait:Texture2D;

	// body transforms
    var body:Transform; 
    var hip:Transform; var torax:Transform; var head:Transform; var hair:Transform;
    var armL:Transform; var subarmL:Transform; var handL:Transform; 
    var armR:Transform; var subarmR:Transform; var handR:Transform;
    var legL:Transform; var sublegL:Transform; var footL:Transform; 
    var legR:Transform; var sublegR:Transform; var footR:Transform;
    var gun:Transform; var cannon:Transform; //var line:LineRenderer;
    var shadow:Transform;

	// body quaternions
    var bodyRot:Quaternion; 
    var hipRot:Quaternion; var toraxRot:Quaternion; var headRot:Quaternion; var hairRot:Quaternion;
    var armLRot:Quaternion; var subarmLRot:Quaternion; var handLRot:Quaternion;
    var armRRot:Quaternion; var subarmRRot:Quaternion; var handRRot:Quaternion;
    var legLRot:Quaternion; var sublegLRot:Quaternion; var footLRot:Quaternion;
    var legRRot:Quaternion; var sublegRRot:Quaternion; var footRRot:Quaternion;
    var gunRot:Quaternion; var cannonRot:Quaternion;
    
    // vectors
    public var aimDisplace:Vector3 = Vector3(0,0,0);
    public var direction:Vector3;
    
    // movement 
    var path = new List.<Vector2>();
	var moving:boolean = false;
 
    // props
    var speedMov:float = 0;
    var speedRot:float = 0;
	var color:Color = new Color(Random.value, Random.value, Random.value);
	var apMax:int = Random.Range(10,20); var ap:int = apMax;
	var hpMax:int = 5; var hp:int = hpMax;
	
	// states
	var stance:String ='stand';
    var ax:String = 'none';
    var dead:boolean = false;
    
    // inventory
    var inventory:Inventory;
	var weapon:Weapon;
	
	// target
	public var target:Player;
	
	var skipWalkability:boolean = false;


	public function init (parent:Transform, num:int, name:String, pos:Vector2, color:Color): void {
		// print('avatar ' + name);
		
		//initialize ent superclass
        super.init(parent, 'Player', num, name, Vector3(1,1,1)); //  pos, , false
		
		// set vars
		speedMov = 8;
		speedRot = 8;
		
		// get body parts as transforms
		getBodyParts();
		
		// paint parts with player's color
		//color = new Color(Random.value, Random.value, Random.value);
		paintBodyParts(color);
	    
	    // initialize inventory
        inventory = gameObject.AddComponent("Inventory") as Inventory; 
        inventory.init(this);

	    // set default pose
        Anim.idle(this);
	}
	

    private function getBodyParts():void {
    	//
        body = transform.Find("Body") as Transform;
        torax = body.Find("Torax") as Transform;
        hip = body.Find("Hip") as Transform;
        head = torax.Find("Head") as Transform;
        hair = head.Find("Hair") as Transform;
        //
        armR = torax.Find("ArmR") as Transform;
        armL = torax.Find("ArmL") as Transform;
        subarmR = armR.Find("SubarmR") as Transform;
        subarmL = armL.Find("SubarmL") as Transform;
        handR = subarmR.Find("HandR") as Transform;
        handL = subarmL.Find("HandL") as Transform;
        //
        legR = hip.Find("LegR") as Transform;
        legL = hip.Find("LegL") as Transform;
        sublegR = legR.Find("SublegR") as Transform;
        sublegL = legL.Find("SublegL") as Transform;
        footR = sublegR.Find("FootR") as Transform;
        footL = sublegL.Find("FootL") as Transform;
        //
        gun = handR.Find("Gun") as Transform;
    }
    
    
    public function paintBodyParts(color):void {
        //armor
        var armorColor:Color  = new Color(Random.value, Random.value, Random.value);
        if(color!=null) { armorColor = color; }
        torax.GetChild(0).renderer.material.color = armorColor;
        //arms
        var armColor:Color = new Color(Random.value, Random.value, Random.value);
        if(color!=null) { armColor = color; }
        armR.GetChild(0).renderer.material.color = armColor;
        armL.GetChild(0).renderer.material.color = armColor;
        subarmR.GetChild(0).renderer.material.color = armColor;
        subarmL.GetChild(0).renderer.material.color = armColor;
        //legs
        var legColor:Color = new Color(Random.value, Random.value, Random.value);
        if(color!=null) { legColor = color; }
        legR.GetChild(0).renderer.material.color = legColor;
        legL.GetChild(0).renderer.material.color = legColor;
        sublegR.GetChild(0).renderer.material.color = legColor;
        sublegL.GetChild(0).renderer.material.color = legColor;
        //boots
        var bootColor:Color = new Color(Random.value, Random.value, Random.value);
        if(color!=null) { bootColor = color; }
        footR.GetChild(0).renderer.material.color = bootColor;
        footL.GetChild(0).renderer.material.color = bootColor;
        //hair
        var hairColor:Color = new Color(Random.value, Random.value, Random.value);
        if(color!=null) { hairColor = color; }
        hair.GetChild(0).renderer.material.color = hairColor;
    }
    
    
    //------------------------------------------------------------------
    // Actions
	
    // toggle stance mode between stand and crouch (when pressing C key) 
    
    public function changeStance():void {
    	// discount ap
    	if(ap < 1) { Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25)); return; }
		ap -= 1; 
    		
    	Audio.play('audio/fx/stepA', transform.position, .7f, Random.Range(2.5, 3.5));
        if (stance == "stand") { 
        	stance = "crouch"; 
        	
        } else { 
        	stance = "stand"; 
        }
        
        Anim.idle(this);
    }
    
    
    // jump action
    
    var jumpStartPos:Vector3;
    var jumpEndPos:Vector3;
    var jumpDist:float;
    var impulse:float;
    //var impulseMax:float;
    //var impulseDir:String;
    var jumpVel:float;
    
    
	public function jump(jumpPoint:Vector2) {
		if(ax == 'jump') { return; }
		ax = 'jump';
		
		jumpStartPos = transform.position;
		jumpEndPos = getPosition(jumpPoint);
	    jumpDist = Vector3.Distance(jumpEndPos, jumpStartPos);
	    
	    //impulseMax = (jumpEndPos.y - jumpStartPos.y);
	    //if (impulseMax < 0.2) { impulseMax = 0.2; }
	    
		impulse = 0.0;
		//impulseDir = 'up';
		
		jumpVel = jumpDist * 0.05;
		
		var type = Grid.getCellType(jumpStartPos.x, jumpStartPos.z);
    	if(type != 'obstacle') {
			Grid.setWalkable(jumpStartPos.x, jumpStartPos.z, true); 
		}

		StartCoroutine(Anim.jump(this, jumpVel)); 	
	}
    
    
    // pickup action
    
	public function pickup() {
		StartCoroutine(Anim.pickup(this));
	}
	
	
	// reload action
	public function reload() {
		StartCoroutine(Anim.reload(this));

		weapon.ammo = weapon.ammoMax;
	}
	
	
	// changeBurstMode action
	public function changeBurstMode() {
	if(weapon.burstMax <= 1) { return; }
		StartCoroutine(Anim.reload(this));
		weapon.burstMode = !weapon.burstMode;
	}
    
    
    // set given avatar as current target
    public function selectTarget(target:Player):void {
    	Audio.play('audio/fx/targetA', transform.position, .7, Random.Range(1.0, 1.5));
    	this.target = target;
    }
    
    
    // set target as null and return to idle pose
    public function deselectTarget():void {
    	Audio.play('audio/fx/targetA', transform.position, .7, Random.Range(0.5, 1.5));
    	this.target = null;
    	Anim.idle(this);
    }
    

    // turn avatar towards given 3d point
    function turnTowards(point:Vector3):void {
    	if(Vector3.Distance(point, transform.position) == 0) {
    		return;
    	}
    	
		// set torax new rotation
    	toraxRot = Quaternion.LookRotation(point - transform.position, Vector3.up); 
    	
    	// if angle between torax and body is too big, rotate body to match torax
    	var angleDiff = getAngleDiff(Vector3.forward, bodyRot, toraxRot);
    	var maxAngle:int = 75; 
    	if(moving && !target) { maxAngle = 10; }
    	if(ax == 'jump' || Mathf.Abs(angleDiff) >= maxAngle) { 
    		bodyRot = toraxRot; 
    	}
    	
    	// if crouching, adjust torax rotation
	    if (stance == 'crouch') {
	    	toraxRot = orientate(toraxRot * Vector3.forward);
	    	toraxRot = toraxRot * Quaternion.Euler(new Vector3(80, 0, 0));
	    }
	    
	    // hide debug line every time we turn
	    //line.gameObject.SetActive(false); 
    }
    
    
    // find a path to given position
    
    public function findPath(x:int ,y:int):void {
    
    	// if we are going-to or going-from an obstacle, we want to jump instead
    	var typeStart = Grid.getCellType(position.x, position.z);
    	var typeEnd = Grid.getCellType(x, y);
    	// if we are going over an obstacle, we want to jump instead
    	//print('findPath from ' + typeStart + ' to ' + typeEnd); 
    	
    	if(typeStart == 'obstacle' || typeEnd == 'obstacle') {
    		jump(Vector2(x + 0.5, y + 0.5));
    		return;
    	}

		//escape if not enough ap
		if(ap <= 0) { ap = 0; Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25)); return; }
		
		// get start and goal points
        var start:Vector2 = new Vector2(transform.position.x, transform.position.z);
        var goal:Vector2 = new Vector2(x, y);
        
        // get C# path list
        path = Grid.astar.SearchPath(start.x, start.y, goal.x, goal.y);
        if(path.Count == 0) { return; }

        // remove first node (is where we are standing on)
        Grid.setWalkable(position.x, position.z, true);
		path.RemoveAt(0);

        // start walkin anim
        Audio.play('audio/fx/stepA', transform.position, 2.0, Random.Range(0.5, 1.0));
        var r:int = 60;
        legRRot = Quaternion.Euler(Vector3(-r,0, 5));
		legLRot = Quaternion.Euler(Vector3(r,0, -5));
		sublegRRot = Quaternion.Euler(Vector3(45,0, 0));
		sublegLRot = Quaternion.Euler(Vector3(-45,0, 0));
		armRRot = Quaternion.Euler(Vector3(20,0, 10));
		armLRot = Quaternion.Euler(Vector3(-20,0, -10));

		// start moving
        moving = true;
    }
    
    
    // move avatar until he reach the goal
    
    public function move():void { 
    	 
	 	// set vars
    	var node:Vector3 = getPosition(Vector2( path[0].x + .5, path[0].y + .5));
    	var dist:float = Vector3.Distance(node, transform.position);
		var direction:Vector3 = (node - transform.position);//.normalized; 
		
    	// relocate avatar in terrain
    	position = transform.position + Vector3(direction.x,0,direction.z);
    	
    	// turn avatar towards node direction
		if(!target) { turnTowards(position + direction); }

		// if walking rotations arrived to the limit, reverse them
		if(Mathf.Abs(legRRot.x-legR.localRotation.x) < .1) {
    		Audio.play('audio/fx/stepA', transform.position, 2.0, Random.Range(0.5, 1.0));
    		
    		var legTemp:Quaternion = legRRot; 
    		legRRot = legLRot; legLRot = legTemp;
    		var sublegTemp:Quaternion = sublegRRot;
    		sublegRRot = sublegLRot; sublegLRot = sublegTemp;
			
			armRRot.eulerAngles.x = -armRRot.eulerAngles.x;
			armLRot.eulerAngles.x = -armLRot.eulerAngles.x;
		}
		
		// set grid cell to not walkable
    	Grid.setWalkable(position.x, position.z, false);
    		
    	// calculate if we have arrived to next node
    	if (dist < 0.15 * interval) { // dist> 0 && 
    		//set position at tile center
    		position = node;
    		transform.position = position;
    		
    		// delete current node from the path list
    		path.RemoveAt(0);
    		
    		// discount ap points
    		if (apMode) { 
	    		ap -= 1; 
	    		if(ap < 0) { 
	    			Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25));
	    			path = new List.<Vector2>(); 
	    			ap = 0;
	    		}
    		}
    		
			// if no path left, set idle pose and stop moving
    		if(path.Count == 0) { 
    			Anim.idle(this); 
    			moving = false; 
    		} else if(path.Count == 1 && isAdjacent(target)) { 
    			path.RemoveAt(0);
    			Anim.idle(this); 
    			moving = false; 
    			slash();
    		} else {
    			// set grid cell to walkable	
    			Grid.setWalkable(position.x, position.z, true);
    		}	
    		
    		// this happens once each time the player reaches the center position of a cell
    		//var cell:Cell = Grid.getCell(position.x, position.z);
    		//print (name + ' at pos ' + cell.x + ' ' + cell.z + ' ' + cell.type);
    	}
    }
    
    
    //------------------------------------------------------------------
	
	// attack action -> slash or shoot
	
	public function isAdjacent (target:Player):boolean {
		if(!target) { return false; }
		var dist:float = Vector2.Distance(Vector2(position.x, position.z), Vector2(target.position.x, target.position.z));
		return dist < 1.8;
	}
	

    public function attack(target:Player):void {
    	// discount ap
    	if (apMode) { 
    		if(ap < 2) { 
    			Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25)); 
    			return; 
    		}
			ap -= 2; if(ap < 0) { ap = 0; }
		}
		
    	// melee weapon pose
	    if (weapon.pose == 'melee') { 
	    	if(isAdjacent(target)) {
	    		// slash if we are adjacent to the target
	    		slash(); 
	    	} else {
	    		// get path and move towards the target
	    		Grid.setWalkable(target.position.x, target.position.z, true);
	    		this.findPath(target.position.x , target.position.z);
    			Grid.setWalkable(target.position.x, target.position.z, false);
	    	}
	    // range weapon pose
	    } else { 
	    	shoot(); 
	    }
    }
	
	
	// shoot
	
	public function shoot() {
		// set aim line
		var hit:RaycastHit = setAimLine(); 
		
		// start shoot animation
		StartCoroutine(Anim.shoot(this));
		
		
		if (weapon.ammo > 0) {
			// create bullet
			Audio.play('audio/fx/ShotA', transform.position, .7, Random.Range(1.0, 1.25));
			var cannonAim:Transform = setCannonAim(); 
			var obj:GameObject = Instantiate(Resources.Load("prefabs/bullet/_Bullet"), cannonAim.position, cannonAim.rotation) as GameObject;
	        var bullet:Bullet = obj.GetComponent("Bullet") as Bullet; 
	        bullet.init(this, hit); 
	        
	        // substract ammo
	        weapon.ammo--; 
	        if (weapon.ammo < 0) { weapon.ammo = 0; }

	    } else {
	    	// no ammo
	    	Audio.play('audio/fx/NoAmmo', transform.position, .7, Random.Range(1.0, 1.25));
	    	weapon.burstNum = weapon.burstMax;
		}
	}
	
	
	// slash
	
	public function slash() {
		// start slash animation
		StartCoroutine(Anim.slash(this));
	}
	
	
	// impact
	
	public function impact(shooter:Player, transf:Transform, delay:float) {
		// set damage
		var damage:int = Random.Range(1,2);
		
		// check death
		if(hp - damage <= 0) {
			death(shooter, transf, 0); 
		} else {
			StartCoroutine(Anim.impact(this, shooter, transf, delay, damage)); 
		}	
	}
	
	
	// death
	
	public function death(shooter:Player, transf:Transform, delay:float) {
		// play dead anim (behavior include it there when coroutine stops)
		StartCoroutine(Anim.death(this, shooter, transf, delay)); 
	}
	
	//------------------------------------------------------------------
 
    // returns a raycastHit from weapon's cannon to selected target 
    
    public function setAimLine():RaycastHit {
    
    	// calculate displace vector (shoot anim adds it to torax and arm rotations)
		var acc:float = 5.0;
    	var angle:Vector3 = new Vector3(Random.Range(-acc, acc), Random.Range(-acc, acc), Random.Range(-acc, acc));
		toraxRot = toraxRot * Quaternion.Euler(angle);
		armRRot = armRRot * Quaternion.Euler(angle);
		// point gun at target plus the displace vector
		gunRot = Quaternion.LookRotation(target.torax.position - gun.position); 
		gunRot = gunRot * Quaternion.Euler(angle);
		// record the displace vector
		aimDisplace = angle;	
		
		// get cannon's final transform
		var cannonAim:Transform = setCannonAim();
        //get start and end points
        var startPoint:Vector3 = cannon.position;
        var endPoint:Vector3 = startPoint + cannon.forward * weapon.range; // use the cannon to get the direction
        //create aiming ray
        var hit:RaycastHit = getRay(startPoint, endPoint, weapon.range);
        // and return it
        return hit; 
    }
    
    
    // get cannon's final aim position and rotation as a transform object
	
	public function setCannonAim():Transform {
		var temp = gun.rotation; 
		gun.rotation = gunRot;
		var cannonAim:Transform = cannon;
		gun.rotation = temp;
		return cannonAim;
	}
	
	
	//------------------------------------------------------------------
	// Update every frame

    function Update() {
    
    	//set time
    	var time = Time.deltaTime;	

    	
    	// update avatar rotations
    	switch(ax) {	
    		
		case 'none':
		case 'walk':
		case 'jump':
			// turn towards target in aim pose
	    	if(target) {
	    		turnTowards(target.transform.position);
	    		Anim.aim(this);
	    	}
	  
	    	//orientate body towards terrain normal
	    	if (ax != 'jump') {
	    		bodyRot = orientate(bodyRot * Vector3.forward);
	    	}
	
	    	// extremities (local rotations)
	    	hip.localRotation = Quaternion.Slerp(hip.localRotation, hipRot, time * (speedRot * interval));
	    	armL.localRotation = Quaternion.Slerp(armL.localRotation, armLRot, time * (speedRot * interval));
	    	subarmL.localRotation = Quaternion.Slerp(subarmL.localRotation, subarmLRot, time * (speedRot * interval));
	    	handL.localRotation = Quaternion.Slerp(handL.localRotation, handLRot, time * (speedRot * interval));
	    	armR.localRotation = Quaternion.Slerp(armR.localRotation, armRRot, time * (speedRot * interval));
	    	subarmR.localRotation = Quaternion.Slerp(subarmR.localRotation, subarmRRot, time * (speedRot * interval));
	    	handR.localRotation = Quaternion.Slerp(handR.localRotation, handRRot, time * (speedRot * interval));
	    	
	    	legR.localRotation = Quaternion.Slerp(legR.localRotation, legRRot, time * (speedRot * interval));
			legL.localRotation = Quaternion.Slerp(legL.localRotation, legLRot, time * (speedRot * interval));
			
			sublegR.localRotation = Quaternion.Slerp(sublegR.localRotation, sublegRRot, time * (speedRot * interval));
			sublegL.localRotation = Quaternion.Slerp(sublegL.localRotation, sublegLRot, time * (speedRot * interval));
			
			// body and torax (global rotations)
	    	body.rotation = Quaternion.Slerp(body.rotation, bodyRot, time * (speedRot * interval * 0.9));
	    	torax.rotation = Quaternion.Slerp(torax.rotation, toraxRot, time * (speedRot * interval));

	    	// gun and head (global or local depending on state and pose)
	    	if(target && weapon.pose != 'melee') {
	    		gun.rotation = Quaternion.Slerp(gun.rotation, gunRot, time * (speedRot * interval));
	    	}else{
	    		gun.localRotation = Quaternion.Slerp(gun.localRotation, gunRot, time * (speedRot * interval));
	    	}
	    	if(target) {
	    		head.rotation = Quaternion.Slerp(head.rotation, headRot, time * (speedRot * interval));
	    	} else{
	    		head.localRotation = Quaternion.Slerp(head.localRotation, headRot, time * (speedRot * interval));
	    	}

		    break;
		    
		default:
			// update rotations while realizing co-routine animations
	    	torax.localRotation = Quaternion.Slerp(torax.localRotation, toraxRot, time * (speedRot * interval));
	    	head.localRotation = Quaternion.Slerp(head.localRotation, headRot, time * (speedRot * interval));
	    	armR.localRotation = Quaternion.Slerp(armR.localRotation, armRRot, time * (speedRot * interval));
	    	subarmR.localRotation = Quaternion.Slerp(subarmR.localRotation, subarmRRot, time * (speedRot * interval));
	    	armL.localRotation = Quaternion.Slerp(armL.localRotation, armLRot, time * (speedRot * interval));
	    	subarmL.localRotation = Quaternion.Slerp(subarmL.localRotation, subarmLRot, time * (speedRot * interval));
	    	hip.localRotation = Quaternion.Slerp(hip.localRotation, hipRot, time * (speedRot * interval));
	    	break;
    	}
    	
    	
    	// move if necessary
		if(moving) { move(); }

		//update avatar position
		position = Vector3.Lerp(transform.position, position, time * (speedMov * interval));
		this.locate(Vector2(position.x, position.z));


		// calculate jump re-position
		
		if (ax == 'jump') {
	    	// relocate avatar in terrain
	    	var dist:float = Vector3.Distance(jumpEndPos, transform.position);
			var direction:Vector3 = (jumpEndPos - jumpStartPos).normalized * 0.1; // jumpStartPos // transform.position
	    	direction.y = 0;
	    	

    		//apply impulse 
    		var yy:float;
    		if(jumpStartPos.y > jumpEndPos.y) {
    			yy = 0.1 + jumpStartPos.y + dist * 0.75;
    		} else {
    			yy = 0.1 + jumpEndPos.y + dist * 0.75;
    		}

    		position = transform.position = transform.position + Vector3(direction.x, yy, direction.z);
    		
    		// turn avatar towards node direction
			if(!target) { 
				turnTowards(jumpEndPos + direction * 100);
			}

    		// end jump
    		if (dist <= 0.5 || transform.position.y <= jumpEndPos.y){
    			ax = 'none'; 
    			position = transform.position = locate(Vector2(jumpEndPos.x, jumpEndPos.z));
    		
    			if(!target) { 
    				direction.y = 0;
    				turnTowards(jumpEndPos + direction * 100); 
    			}
    		}
    	}		
    	
	}
	



	// Parabola experimentations...
	
//	public function PlotTrajectoryAtTime (start:Vector3, startVelocity:Vector3, time:float): Vector3 {
//    	return start + startVelocity * time + Physics.gravity * time * time * 0.5f;
//	}
//
//
//	public function PlotTrajectory (start:Vector3, startVelocity:Vector3, timestep:float, maxTime:float): void  {
//	    var prev:Vector3  = start;
//	    for (var i:int  = 1;; i++) {
//	        var t:float = timestep*i;
//	        if (t > maxTime) { 
//	        	break; 
//	        }
//	        var pos:Vector3  = PlotTrajectoryAtTime (start, startVelocity, t);
//	        if (Physics.Linecast (prev, pos)) {
//	        	break;
//	        } 
//	        Debug.DrawLine (prev,pos,Color.red);
//	        prev = pos;
//	    }
//	}
//	
//	
//	function BallisticVel(dir:Vector3): Vector3 {
//		//target: Transform
//		//var dir = target.position - transform.position; // get target direction
//		var h = dir.y;  // get height difference
//		dir.y = 0;  // retain only the horizontal direction
//		var dist = dir.magnitude;  // get horizontal distance
//		dir.y = dist;  // set elevation to 45 degrees
//		dist += h;  // correct for different heights
//		var vel = Mathf.Sqrt(dist * Physics.gravity.magnitude);
//		return vel * dir.normalized;  // returns Vector3 velocity
//	}
	
}


