#pragma strict

class Controls extends MonoBehaviour {

	var shiftDown:boolean = false;
	var controlDown:boolean = false;
	var altDown:boolean = false;
	
	var jDown:boolean = false;


	function init () {
	}	
	
	
	function Update() {
        Mouse();
        Keys();
    }
    
    
    function Mouse() {
    
    	if(World.av == null) { return; }
    
    	//listen for left-mouse-up
        if (Input.GetButtonUp("Fire1")) {

            //escape listener if mouse is inside a gui element
            //Vector2 mPos = new Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
            //if (gui.mouseRect.Contains(mPos)) { return; }

            // check hit ray for mouse clicks
            var ray:Ray  = Camera.main.ScreenPointToRay(Input.mousePosition);
            var hit:RaycastHit  = new RaycastHit();
            if (Physics.Raycast(ray, hit, 1000)) {
            	if(!hit.transform) { print('Hit error!'); return; }
            	
            	var layerName = LayerMask.LayerToName(hit.transform.gameObject.layer);
                switch (layerName) {
                // Terrain
                case 'Terrain': 
                    if (shiftDown) {
                    	// turn avatar in the direction of the mouse
                    	if(World.av.target) { 
                    		World.av.deselectTarget(); 
                    	} else {
                    		World.av.turnTowards(hit.point);
                    	}
                    //} else if (jDown) {
                    	// jump
                    	//World.av.jump(Vector2(Mathf.FloorToInt(hit.point.x) + 0.5, Mathf.FloorToInt(hit.point.z) + 0.5));
                    	
                    } else if (altDown) {
                    	// point camera at clicked cell
                        World.cam.center = hit.point - World.av.gameObject.transform.position;  
                    } else {
                    	// find a path to the clicked cell
                    	
                    	//var type = Grid.getCellType(hit.point.x, hit.point.z);
                    	//print('>>>' + type);
                    	//World.av.findPath(Mathf.FloorToInt(hit.point.x),Mathf.FloorToInt(hit.point.z)); 
                    	
                    	World.av.findPath(hit.point.x, hit.point.z);   
                    }
                    break;
                case 'Player':
                	// get clicked avatar (collider is placed on the torax, so go up 2 levels)
                	var avatar:Player = hit.transform.parent.parent.GetComponent("Player") as Player;
                	if(avatar === World.av) {
                		// if we click on ourself, make the avatar sit down and rest
                		print('SIT DOWN!');
                		print(avatar.position);
                	} else {
                		// if we click on a friend
                		if(avatar.team == World.av.team) {
                			// select him
                			avatar.team.selectPlayer(avatar.num);
                		// if we click on an opponent, 
                		} else {
	                		//target him, if already targeted, attack him
		                	if(avatar != World.av.target) {
		                		// select target
		                		World.av.selectTarget(avatar);
		                	} else {
		                		// attack target
		                		World.av.attack(avatar);
		                	}
	                	}
	                }
                	break; 
                }
            }
            
        }
    
    }
    
    
    function Keys() {
        // shift-control-alt states
        if (Input.GetKeyDown(KeyCode.LeftShift)) { shiftDown = true; }
        if (Input.GetKeyUp(KeyCode.LeftShift)) { shiftDown = false; }
        if (Input.GetKeyDown(KeyCode.LeftControl)) { controlDown = true; }
        if (Input.GetKeyUp(KeyCode.LeftControl)) { controlDown = false; }
        if (Input.GetKeyDown(KeyCode.LeftAlt)) { altDown = true; }
        if (Input.GetKeyUp(KeyCode.LeftAlt)) { altDown = false; }
        
        if (Input.GetKeyDown('j')) { jDown = true; }
        if (Input.GetKeyUp('j')) { jDown = false; }
        
        // action keys
        if (Input.GetKeyUp("return") || Input.GetKeyUp("enter")) { World.selectNextTeam(); }
        if (Input.GetKeyUp("space")) { World.team.selectNextPlayer(); }
        if (Input.GetKeyUp("c")) { World.av.changeStance(); }  
        if (Input.GetKeyUp("r")) { World.av.reload(); }  
        if (Input.GetKeyUp("g")) { World.av.pickup(); }  
        if (Input.GetKeyUp("b")) { World.av.changeBurstMode(); }  

        // system keys
        if (Input.GetKeyUp("q")) { World.world.reset(); }  
    }

}