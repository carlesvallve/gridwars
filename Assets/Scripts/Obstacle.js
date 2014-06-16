#pragma strict

// TODO: Create a cube mesh from scratch, and set cell's lower vertices to match mesh vertices

class Obstacle extends Entity {

    function init (parent:Transform, layer:String, num:int, name:String, scale:Vector3): void { 
    	//initialize ent superclass
        super.init(parent, layer, num, name, Vector3(1,1,1)); //Vector3(1,1,1)); // scale   
        
        //transform.position.y = 0;//
        
        //World.terrain.makeCube(gameObject, scale.y);
        
        

    }
    
}    