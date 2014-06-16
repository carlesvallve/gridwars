#pragma strict

class Bullet extends MonoBehaviour {

	public var num:int;
	public var av:Player;
    public var hit:RaycastHit;
    public var speed:float = 1.25; 


    function init(av:Player , hit:RaycastHit):void {
    	this.av = av;
    	this.hit = hit;
    	num = World.bullets.length;
    	name = "Bullet" + num; 
        transform.parent = World.temp.transform; 
        //World.bullets.Add(this);        	
    }
    
    
    function Update() {
    	
    	var dist:float  = Vector3.Distance(hit.point, transform.position);
    	
    	// bullet advance
    	if (dist > speed) {
    		transform.Translate(new Vector3(0, 0, speed));
    		
    	// bullet arrive
		} else {

			// locate bullet at destination point
			transform.position = hit.point;
			
			// play bullet impact sound
			Audio.play('audio/fx/hitA', hit.point, .4, Random.Range(2.0, 3.0));
			
			// get impact layer name
			var layerName:String = 'None';
			if(hit.transform) { layerName = LayerMask.LayerToName(hit.transform.gameObject.layer); }
			
			// set impact cases
			var color:Color;
			switch(layerName) {
				case 'None':
					color = Color.cyan;
					break;
				case 'Terrain':
					color = Color.grey;
					break;
				case 'Player':
					color = Color.red;
					// init impact on target avatar
					var target:Player = hit.transform.parent.parent.GetComponent("Player") as Player;
					target.impact(av, transform, 0);				
					break;
			}
	
			// create explosion object
			var obj:GameObject = Instantiate(Resources.Load("prefabs/explosion/_Explosion"), 
											 transform.position, transform.rotation) as GameObject;
		    var expl:Explosion = obj.GetComponent("Explosion") as Explosion; 
		    expl.init(num, color, hit.normal);
			
			// destroy bullet
			Destroy(this.gameObject);
			
    	}
    	
    }
   
}