//#pragma strict
//
//import System.Collections.Generic; //  we need this for the astar path:List.<Vecttor2>
//
//class Avatar extends Entity {
//
//	//vars
//	//var speed:float = 0;
//	var speedRot:float = 0;
//	var speedMov:float = 0;
//	var color:Color = new Color(Random.value, Random.value, Random.value);
//	var portrait:Texture2D;
//
//	//body parts
//    public var body:Transform; 
//    public var hip:Transform; var torax:Transform; var head:Transform; var hair:Transform;
//    public var armL:Transform; var armR:Transform; var subarmL:Transform; var subarmR:Transform; var handL:Transform; var handR:Transform;
//    public var legL:Transform; var legR:Transform; var sublegL:Transform; var sublegR:Transform; var footL:Transform; var footR:Transform;
//    public var gun:Transform; var cannon:Transform; //var line:LineRenderer;
//    public var shadow:Transform;
//
//    public var bodyRot:Quaternion; 
//    public var toraxRot:Quaternion;
//    public var hipRot:Quaternion;
//    public var headRot:Quaternion;
//    public var armLRot:Quaternion;
//    public var subarmLRot:Quaternion;
//    public var handLRot:Quaternion;
//    public var armRRot:Quaternion;
//    public var subarmRRot:Quaternion;
//    public var handRRot:Quaternion;
//    public var gunRot:Quaternion;
//    
//    public var legRRot:Quaternion;
//    public var legLRot:Quaternion;
//    public var sublegRRot:Quaternion;
//    public var sublegLRot:Quaternion;
//    
//    public var stance:String ='stand';
//    public var ax:String = 'none';
//    public var target:Avatar;
//    
//    public var inventory:Inventory;
//    public var weapon:Weapon;
//
//    public var aimDisplace:Vector3 = Vector3(0,0,0);
//    
//    var position:Vector3;
//    var lastPosition:Vector3;
//    public var path = new List.<Vector2>();
//    public var moving:boolean = false;
//    
//    public var direction:Vector3;
//    
//    public var apMax:int = Random.Range(10,20);
//    public var ap:int = apMax;
//    
//    public var hpMax:int = 10;
//    public var hp:int = hpMax;
//    
//    public var dead:boolean = false;
//    
//
//	function init (parent:Transform, name:String, num:int, pos:Vector2, portraitName:String) {
//
//		// set vars
//		speedMov = 8;
//		speedRot = 8;
//		color = new Color(Random.value, Random.value, Random.value);
//		
//		// get portrait texture
//		if(!portraitName){ portraitName = 'G' + Random.Range(1,56); }
//		portrait = Resources.Load('hud/portraits/' + portraitName);
//
//        // get avatar body parts as transforms
//        getBodyParts();
//
//        // paint body parts with a random color
//        paintBodyParts(color);
//        
//        // initialize inventory
//        //inventory = gameObject.AddComponent("Inventory") as Inventory; 
//        //inventory.init(this);
//
//        // set default pose
//        Anim.idle(this);
//        
//        //initialize ent superclass
//        super.init(parent, 'Avatar', name, num, pos, Vector3(1,1,1));
//   
//	}
//	
//   
//	//record body parts transforms
//	
//    private function getBodyParts():void {
//    	//
//        body = transform.Find("Body") as Transform;
//        torax = body.Find("Torax") as Transform;
//        hip = body.Find("Hip") as Transform;
//        head = torax.Find("Head") as Transform;
//        hair = head.Find("Hair") as Transform;
//        //
//        armR = torax.Find("ArmR") as Transform;
//        armL = torax.Find("ArmL") as Transform;
//        subarmR = armR.Find("SubarmR") as Transform;
//        subarmL = armL.Find("SubarmL") as Transform;
//        handR = subarmR.Find("HandR") as Transform;
//        handL = subarmL.Find("HandL") as Transform;
//        //
//        legR = hip.Find("LegR") as Transform;
//        legL = hip.Find("LegL") as Transform;
//        sublegR = legR.Find("SublegR") as Transform;
//        sublegL = legL.Find("SublegL") as Transform;
//        footR = sublegR.Find("FootR") as Transform;
//        footL = sublegL.Find("FootL") as Transform;
//        //
//        gun = handR.Find("Gun") as Transform;
//    }
//    
//    
//    //paint body parts with random colors
//    
//    public function paintBodyParts(color):void {
//        //armor
//        var armorColor:Color  = new Color(Random.value, Random.value, Random.value);
//        if(color!=null) { armorColor = color; }
//        torax.GetChild(0).renderer.material.color = armorColor;
//        //arms
//        var armColor:Color = new Color(Random.value, Random.value, Random.value);
//        if(color!=null) { armColor = color; }
//        armR.GetChild(0).renderer.material.color = armColor;
//        armL.GetChild(0).renderer.material.color = armColor;
//        subarmR.GetChild(0).renderer.material.color = armColor;
//        subarmL.GetChild(0).renderer.material.color = armColor;
//        //legs
//        var legColor:Color = new Color(Random.value, Random.value, Random.value);
//        if(color!=null) { legColor = color; }
//        legR.GetChild(0).renderer.material.color = legColor;
//        legL.GetChild(0).renderer.material.color = legColor;
//        sublegR.GetChild(0).renderer.material.color = legColor;
//        sublegL.GetChild(0).renderer.material.color = legColor;
//        //boots
//        var bootColor:Color = new Color(Random.value, Random.value, Random.value);
//        if(color!=null) { bootColor = color; }
//        footR.GetChild(0).renderer.material.color = bootColor;
//        footL.GetChild(0).renderer.material.color = bootColor;
//        //hair
//        var hairColor:Color = new Color(Random.value, Random.value, Random.value);
//        if(color!=null) { hairColor = color; }
//        hair.GetChild(0).renderer.material.color = hairColor;
//    }
//    
//    //------------------------------------------------------------------
//	
//	public function findPath(x:int ,y:int):void {
//		//print(ap);
//		//escape if not enough ap
//		if(ap <= 0) { ap = 0; Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25)); return; }
//		
//		// get start and goal points
//        var start:Vector2 = new Vector2(transform.position.x, transform.position.z);
//        var goal:Vector2 = new Vector2(x, y);
//        // get C# path list
//        path = Grid.astar.SearchPath(start.x, start.y, goal.x, goal.y);
//        // remove first node (is where we are standing on)
//		path.RemoveAt(0);
//
//        // start walkin anim
//        Audio.play('audio/fx/stepA', transform.position, 2.0, Random.Range(0.5, 1.0));
//        var r:int = 60;
//        legRRot = Quaternion.Euler(Vector3(-r,0, 5));
//		legLRot = Quaternion.Euler(Vector3(r,0, -5));
//		sublegRRot = Quaternion.Euler(Vector3(45,0, 0));
//		sublegLRot = Quaternion.Euler(Vector3(-45,0, 0));
//		armRRot = Quaternion.Euler(Vector3(20,0, 10));
//		armLRot = Quaternion.Euler(Vector3(-20,0, -10));
//
//		// start moving
//        moving = true;
//    }
//    
//    public function move():void {
//    	
//    	var node:Vector3 = getPosition(Vector2( path[0].x + .5, path[0].y + .5));
//    	var dist:float = Vector3.Distance(node, transform.position);
//		var direction:Vector3 = (node - transform.position);//.normalized; 
//		
//		// turn avatar towards node direction
//		if(!target) { turnTowards(position + direction); }
//
//    	// relocate avatar in terrain
//    	position = transform.position + Vector3(direction.x,0,direction.z);
//
//		// if walking rotations arrived to the limit, reverse them
//		if(Mathf.Abs(legRRot.x-legR.localRotation.x) < .1) {
//    		Audio.play('audio/fx/stepA', transform.position, 2.0, Random.Range(0.5, 1.0));
//    		
//    		var legTemp:Quaternion = legRRot; 
//    		legRRot = legLRot; legLRot = legTemp;
//    		var sublegTemp:Quaternion = sublegRRot;
//    		sublegRRot = sublegLRot; sublegLRot = sublegTemp;
//			
//			armRRot.eulerAngles.x = -armRRot.eulerAngles.x;
//			armLRot.eulerAngles.x = -armLRot.eulerAngles.x;
//		}
//		
//    	// calculate if we have arrived to next node
//    	if (dist> 0 && dist < 0.15) {
//    		//set position at tile center
//    		position = node;
//    		transform.position = position;
//    		// delete current node from the path list
//    		path.RemoveAt(0);
//    		// discount ap points
//    		ap -= 1; 
//    		if(ap <0) { 
//    			Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25));
//    			path = new List.<Vector2>(); 
//    			ap = 0;
//    		}
//			// if no path left, set idle pose and stop moving
//    		if(path.Count == 0) { Anim.idle(this); moving =false; } 
//    	} 
//
//    }
//    
//    //------------------------------------------------------------------
//
//    // turn avatar towards given 3d point
//    
//	function turnTowards(point:Vector3):void {
//		// set torax new rotation
//    	toraxRot = Quaternion.LookRotation(point - transform.position, Vector3.up); 
//    	
//    	// if angle between torax and body is too big, rotate body to match torax
//    	var angleDiff = getAngleDiff(Vector3.forward, bodyRot, toraxRot);
//    	var maxAngle:int = 75; 
//    	if(moving && !target) { maxAngle = 10; }
//    	if(Mathf.Abs(angleDiff) >= maxAngle) { 
//    		bodyRot = toraxRot; 
//    	}
//    	
//    	// if crouching, adjust torax rotation
//	    if (stance == 'crouch') {
//	    	toraxRot = orientate(toraxRot * Vector3.forward);
//	    	toraxRot = toraxRot * Quaternion.Euler(new Vector3(80, 0, 0));
//	    }
//	    
//	    // hide debug line every time we turn
//	    line.gameObject.active = false;
//	    
//    }
//    
//    //------------------------------------------------------------------
//    
//    // update avatar  every frame
//    
//    function Update() {
//
//    	// set time
//    	var time = Time.deltaTime;
//    	
//    	// escape if we are dead
//    	//if(ax == 'death') { return; }
//    	
//    	// update avatar rotations
//    	switch(ax) {	
//    		
//		case 'none':
//		case 'walk':
//			// turn towards target in aim pose
//	    	if(target) {
//	    		turnTowards(target.transform.position);
//	    		Anim.aim(this);
//	    	}
//	  
//	    	//orientate body towards terrain normal
//	    	bodyRot = orientate(bodyRot * Vector3.forward);
//	
//	    	// extremities (local rotations)
//	    	hip.localRotation = Quaternion.Slerp(hip.localRotation, hipRot, time * (speedRot * 1));
//	    	armL.localRotation = Quaternion.Slerp(armL.localRotation, armLRot, time * (speedRot * 1));
//	    	subarmL.localRotation = Quaternion.Slerp(subarmL.localRotation, subarmLRot, time * (speedRot * 1));
//	    	handL.localRotation = Quaternion.Slerp(handL.localRotation, handLRot, time * (speedRot * 1));
//	    	armR.localRotation = Quaternion.Slerp(armR.localRotation, armRRot, time * (speedRot * 1));
//	    	subarmR.localRotation = Quaternion.Slerp(subarmR.localRotation, subarmRRot, time * (speedRot * 1));
//	    	handR.localRotation = Quaternion.Slerp(handR.localRotation, handRRot, time * (speedRot * 1));
//	    	
//	    	legR.localRotation = Quaternion.Slerp(legR.localRotation, legRRot, time * (speedRot * 1));
//			legL.localRotation = Quaternion.Slerp(legL.localRotation, legLRot, time * (speedRot * 1));
//			
//			sublegR.localRotation = Quaternion.Slerp(sublegR.localRotation, sublegRRot, time * (speedRot * 1));
//			sublegL.localRotation = Quaternion.Slerp(sublegL.localRotation, sublegLRot, time * (speedRot * 1));
//			
//			// body and torax (global rotations)
//	    	body.rotation = Quaternion.Slerp(body.rotation, bodyRot, time * (speedRot * 0.9));
//	    	torax.rotation = Quaternion.Slerp(torax.rotation, toraxRot, time * (speedRot * 1));
//
//	    	// gun and head (global or local depending on state and pose)
//	    	if(target && weapon.pose != 'melee') {
//	    		gun.rotation = Quaternion.Slerp(gun.rotation, gunRot, time * (speedRot * 1));
//	    	}else{
//	    		gun.localRotation = Quaternion.Slerp(gun.localRotation, gunRot, time * (speedRot * 1));
//	    	}
//	    	if(target) {
//	    		head.rotation = Quaternion.Slerp(head.rotation, headRot, time * (speedRot * 1));
//	    	} else{
//	    		head.localRotation = Quaternion.Slerp(head.localRotation, headRot, time * (speedRot * 1));
//	    	}
//		    
//		    break;
//		    
//		default:
//		
//			// update rotations while realizing co-routine animations
//	    	torax.localRotation = Quaternion.Slerp(torax.localRotation, toraxRot, time * (speedRot * 1));
//	    	head.localRotation = Quaternion.Slerp(head.localRotation, headRot, time * (speedRot * 1));
//	    	armR.localRotation = Quaternion.Slerp(armR.localRotation, armRRot, time * (speedRot * 1));
//	    	subarmR.localRotation = Quaternion.Slerp(subarmR.localRotation, subarmRRot, time * (speedRot * 1));
//	    	armL.localRotation = Quaternion.Slerp(armL.localRotation, armLRot, time * (speedRot * 1));
//	    	subarmL.localRotation = Quaternion.Slerp(subarmL.localRotation, subarmLRot, time * (speedRot * 1));
//	    	
//	    	hip.localRotation = Quaternion.Slerp(hip.localRotation, hipRot, time * (speedRot * 1));
//	    	
//	    	break;
//	    	
//    	}
//    	
//    	//update avatar position
//		if(moving) { 
//			move(); 
//			transform.position = Vector3.Lerp(transform.position, position, time * (speedMov * 1));
//			transform.position.y = getPosition(Vector2(transform.position.x, transform.position.z)).y; 
//		}
//    		
//	}
//	
//	//------------------------------------------------------------------
//	
//    // toggles stance mode between stand and crouch (when pressing C key)
//    
//    public function changeStance():void {
//    	// discount ap
//    	if(ap < 1) { Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25)); return; }
//		ap -= 1; 
//    		
//    	Audio.play('audio/fx/stepA', transform.position, .7f, Random.Range(2.5, 3.5));
//        if (stance == "stand") { 
//        	stance = "crouch"; 
//        	
//        } else { 
//        	stance = "stand"; 
//        }
//        Anim.idle(this);
// 
//    }
//    
//    // pickup action
//	
//	public function pickup() {
//		StartCoroutine(Anim.pickup(this));
//	}
//	
//	// reload action
//	
//	public function reload() {
//		StartCoroutine(Anim.reload(this));
//	}
//    
//    // set given avatar as current target
//    
//    public function selectTarget(target:Avatar):void {
//    	Audio.play('audio/fx/targetA', transform.position, .7, Random.Range(1.0, 1.5));
//    	this.target = target;
//    }
//    
//    // set target as null and return to idle pose
//    
//    public function deselectTarget():void {
//    	Audio.play('audio/fx/targetA', transform.position, .7, Random.Range(0.5, 1.5));
//    	this.target = null;
//    	Anim.idle(this);
//    }
//
//	//------------------------------------------------------------------
//	
//	// attack action -> slash or shoot
//    
//    public function attack(target:Avatar):void {
//    	// discount ap
//    	if(ap < 2) { Audio.play('audio/fx/LaserA', transform.position, .7, Random.Range(1.0, 1.25)); return; }
//		ap -= 2; if(ap < 0) { ap = 0; }
//    	// initialize slash or shoot action
//	    if (weapon.pose == 'melee') { slash(); } else { shoot(); }
//    }
//	
//	// shoot
//	
//	public function shoot() {
//		// set aim line
//		var hit:RaycastHit = setAimLine(); 
//		// start shoot animation
//		StartCoroutine(Anim.shoot(this));
//		// initialize bullet
//		if (weapon.ammo > 0) {
//			// create bullet
//			Audio.play('audio/fx/ShotA', transform.position, .7, Random.Range(1.0, 1.25));
//			var cannonAim:Transform = setCannonAim(); 
//			var obj:GameObject = Instantiate(Resources.Load("prefabs/bullet/_Bullet"), cannonAim.position, cannonAim.rotation) as GameObject;
//	        var bullet:Bullet = obj.GetComponent("Bullet") as Bullet; 
//	        bullet.init(this, hit); 
//	    } else {
//	    	// no ammo
//	    	Audio.play('audio/fx/NoAmmo', transform.position, .7, Random.Range(1.0, 1.25));
//		}
//	}
//	
//	// slash
//	
//	public function slash() {
//		// start slash animation
//		StartCoroutine(Anim.slash(this));
//		target.impact(this,target.transform, 0.35);
//	}
//	
//	// impact
//	
//	public function impact(shooter:Avatar, transf:Transform, delay:float) {
//		// impact
//		StartCoroutine(Anim.impact(this, shooter, transf, delay)); 
//		// discount hp
//		hp -= Random.Range(1,4); //hp = 0;
//		// check death
//		if(hp <= 0) { 
//			hp = 0; 
//			death(shooter, transf, delay); 
//		}
//	}
//	
//	// death
//	
//	public function death(shooter:Avatar, transf:Transform, delay:float) {
//		StartCoroutine(Anim.death(this, shooter, transf, delay)); 
//		weapon.entity.orientate(weapon.go.transform.forward);
//	}
//	
//	//------------------------------------------------------------------
// 
//    // returns a raycastHit from weapon's cannon to selected target 
//    
//    public function setAimLine():RaycastHit {
//    
//    	// calculate displace vector (shoot anim adds it to torax and arm rotations)
//		var acc:float = 5.0;
//    	var angle:Vector3 = new Vector3(Random.Range(-acc, acc), Random.Range(-acc, acc), Random.Range(-acc, acc));
//		toraxRot = toraxRot * Quaternion.Euler(angle);
//		armRRot = armRRot * Quaternion.Euler(angle);
//		// point gun at target plus the displace vector
//		gunRot = Quaternion.LookRotation(target.torax.position - gun.position); 
//		gunRot = gunRot * Quaternion.Euler(angle);
//		// record the displace vector
//		aimDisplace = angle;	
//		
//		// get cannon's final transform
//		var cannonAim:Transform = setCannonAim();
//        //get start and end points
//        var startPoint:Vector3 = cannon.position;
//        var endPoint:Vector3 = startPoint + cannon.forward * weapon.range; // use the cannon to get the direction
//        //create aiming ray
//        var hit:RaycastHit = getRay(startPoint, endPoint, weapon.range);
//        // and return it
//        return hit; 
//    }
//    
//    // get cannon's final aim position and rotation as a transform object
//	
//	public function setCannonAim():Transform {
//		var temp = gun.rotation; 
//		gun.rotation = gunRot;
//		var cannonAim:Transform = cannon;
//		gun.rotation = temp;
//		return cannonAim;
//	}
//	
//	//------------------------------------------------------------------
//      
//}