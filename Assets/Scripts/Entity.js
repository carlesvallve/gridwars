#pragma strict

class Entity extends MonoBehaviour {

	var num:int;
	var walkable: boolean = false;
	
	var hit:RaycastHit;
	var line:LineRenderer;
	var debug:boolean = false;
	
	var position:Vector3;
	var lastPosition:Vector3;
	
	
	
	public function init(parent:Transform, layer:String, num:int, name:String, scale:Vector3):void { // pos:Vector2, , walkable: boolean
        // vars
        this.num = num;
        this.name = name;
        
        //transform.localScale = scale;
        
        // assign ent's parent and layer
        this.transform.parent = parent; 
        if(!gameObject.layer || gameObject.layer == 'Default') {
        	gameObject.layer = LayerMask.NameToLayer(layer);
        }
			
        // locate ent on terrain
//        if(pos != Vector2(-1, -1)) {
//        	position = this.locate(pos);
//        } else {
//        	position = this.locate(this.getRandomPosition());
//        }
//        Grid.setWalkable(position.x, position.z, walkable);
    }
    
    
    public function destroy(): void {
    	// restore cell walkability
    	Grid.setWalkable(transform.position.x, transform.position.z, true);
    	Destroy(gameObject); //Destroys the object the script is attached to
    }
    
	
	// locate avatar in terrain
	
	public function locate(pos:Vector2):Vector3 {
		position = this.transform.position = this.getPosition(pos);
		// print('locate ' + name + ' ' + position);
		return position;
	}
	

	// returns position vector on terrain at the given coords
	    
		function getPosition(pos:Vector2):Vector3 {
	        var position:Vector3;
	        
	        hit = getHit(pos); 
	        if (hit.transform) {
	        	//locate
	            position = hit.point;
	        } else {
	        	//locate without snapping to terrain
	        	position = new Vector3(pos.x, transform.position.y, pos.y); 
	        }
	        
	        return position;
	    }
	    

    // get random position on terrain inside a 1 cell perimeter
    
    public function getRandomPosition(perimeter:int):Vector2 {
    	//var x:int = 0; var y:int = 0;
        var walkable:boolean = false; var esc:int = 0; 
        while (walkable == false) {
            //var x:int = Random.Range(1, World.terrain.width-2);
            //var y:int = Random.Range(1, World.terrain.height -2); 
            var x:int = Random.Range(perimeter, World.terrain.width - perimeter - 1);
            var y:int = Random.Range(perimeter, World.terrain.height - perimeter - 1); 
            walkable = Grid.getWalkable(x, y);
            esc++; 
            if(esc == 1000) { walkable = true; }
        }
        
        var pos:Vector2 = new Vector2(x + .5, y + .5);
        return pos; 
    }

	// get random position on given rect (origin at center)

    public function getRandomPosition(rect:Rect):Vector2 {
        var x:int = 0; var y:int = 0; var esc:int = 0;
        var walkable:boolean = false;
        
        while (walkable == false) {
            x = rect.x + Random.Range(-rect.width, rect.width); 
            y = rect.y + Random.Range(-rect.height, rect.height); 
            walkable = Grid.getWalkable(x, y);
            
            esc++; 
            if(esc == 1000){ walkable = true; }
        }
        
        var pos:Vector2 = new Vector2(x + .5, y + .5);
        return pos; 
    }


    // returns terrain orientation
    
    function orientate(fwd:Vector3):Quaternion { 
        var rot:Quaternion  = Quaternion.identity;
        if (hit.transform) {
	    	// get rotation
	        var proj:Vector3  = fwd - (Vector3.Dot(fwd, hit.normal)) * hit.normal;
	        rot = Quaternion.LookRotation(proj, hit.normal); 
	        return rot;         
        } 
        return Quaternion.identity;
    }
    
    
	// cast a vertical ray through the world y-axis at the given position
	// note: debug will only be visible if we execute this every frame.
	
	function getHit(pos2d:Vector2):RaycastHit {

		// This would cast rays only against colliders in layer 8(Terrain).
		var layerMask = 1 << 8;
		
		// If instead we want to collide against everything except layer 9(Player): 
		// The ~ operator does this, it inverts a bitmask.
		// var layerMask = 1 << 9;
		// layerMask = ~layerMask;
		
		var hit : RaycastHit;
		var vector = transform.TransformDirection(Vector3.down); 
		var pos:Vector3 = new Vector3(pos2d.x, 100, pos2d.y); 

		// Does the ray intersect any objects in the terrain layer?
		if (Physics.Raycast (pos, vector, hit, Mathf.Infinity, layerMask)) {
			if(debug) { Debug.DrawRay (pos, vector * hit.distance, Color.green); }
			// print ("Did Hit");
		} else {
			 // if(debug) { Debug.DrawRay (pos, vector * 1000, Color.red); }
			// print ("Did not Hit");
		}

		return hit; 
	}
	

    // cast a ray from start to end point in a maximum distance
    
    public function getRay(startPoint:Vector3, endPoint:Vector3, distance:float):Object {

        //get direction vector
        var direction:Vector3 = endPoint - startPoint;
        
        //cast a ray from start to end points
        var ray:Ray  = new Ray(startPoint, direction); 
        var hit:RaycastHit = new RaycastHit();
        
        //check if we hitted something
        if (Physics.Raycast(ray, hit, distance)) { //, 1 << 9
            var color:Color = Color.green;
            if(hit.transform.gameObject.tag != 'Player') {
            	color = Color.red;
            } 
        } else {
        	//hit.point = startPoint * (angle * distance);
        	hit.point = ray.GetPoint(distance);
        	hit.distance = distance;
        	color = Color.red;
        }
        
        // debug the ray if needed
        if(line) {
        	line.gameObject.SetActive(debug);
	        if(debug) { 
	        	// Debug.DrawRay (startPoint, direction * hit.distance, color); // -> why doesnt work (?)
	        	line.SetPosition(0, startPoint); 
	        	line.SetPosition(1, hit.point);
	        	line.SetColors(color, color);
	        }   
        }

        // return the raycast hit object
        return hit;
    }
    
	
	// returns the angle between 2 rotations
	// Angle differences on the X-Z plane. Suitable for "top down" angle differences
	
	public function getAngleDiff(fwd:Vector3, rotationA:Quaternion, rotationB:Quaternion):float {
		
		//the unsigned angle between two quaternions:
		//var angleDiff = Quaternion.Angle( bodyRot, toraxRot );
		//however, we can use "Mathf.DeltaAngle" to get the signed difference between two angles
		
		// get a "forward vector" for each rotation
		var forwardA:Vector3 = rotationA * fwd; //Vector3.forward;
		var forwardB:Vector3 = rotationB * fwd; //Vector3.forward;
		// get a numeric angle for each vector, on the X-Z plane (relative to world forward)
		var angleA:float = Mathf.Atan2(forwardA.x, forwardA.z) * Mathf.Rad2Deg;
		var angleB:float = Mathf.Atan2(forwardB.x, forwardB.z) * Mathf.Rad2Deg;
		// get the signed difference in these angles
		var angleDiff:float = Mathf.DeltaAngle( angleA, angleB );
		// return it
		return angleDiff;
	}
  
}


//--------------------------------------------------------------------
// UNUSED FUNCTIONS
//--------------------------------------------------------------------

// create a gameobject with given parameters and return as a transform
    
//    function createElement(type:String, name:String, parent:Transform, pos:Vector3, scale:Vector3):Transform {
//    	var elm:Transform;
//    	switch (type) {
//		case 'empty':
//			elm = new GameObject( name ).transform;
//			break;
//		case 'cube':
//			elm = GameObject.CreatePrimitive(PrimitiveType.Cube).transform;
//			break;	
//    	}
//    	elm.name = name;
//        elm.parent = parent;
//        elm.position = pos;
//        elm.localScale = scale;
//        return elm;
//    }

// returns the shortest angle from fwd to targetDir vectors
    
//    function ContAngle(fwd: Vector3, targetDir: Vector3, upDir: Vector3) {
//    	var angle = Vector3.Angle(fwd, targetDir);
//	    if (AngleDir(fwd, targetDir, upDir) == -1) {
//	        return 360 - angle;
//	    } else {
//	        return angle;
//	    }
//	}
//    
//    //returns -1 when to the left, 1 to the right, and 0 for forward/backward
//
//	public function AngleDir(fwd: Vector3, targetDir: Vector3, up: Vector3) : float {
//	
//	    var perp: Vector3 = Vector3.Cross(fwd, targetDir);
//	    var dir: float = Vector3.Dot(perp, up);
//	
//	    if (dir > 0.0) {
//	        return 1.0;
//	    } else if (dir < 0.0) {
//	        return -1.0;
//	    } else {
//	        return 0.0;
//	    }
//	
//	}