#pragma strict

public var center:Vector3 = Vector3(0,0,0);
public var pos:Vector3 = Vector3(0,0,0);

//public var angle:int = 0;
//public var time:float;
//public var speed:float = 0.025;
//public var update:boolean = false;
//private var lastTime:float = 0;


function init() {
	// set center at the center of the world
	center = Vector3(-.5 + World.terrain.width/2, 0 , -.5 + World.terrain.height/2);
	transform.position = center;

	// set sun light at given position
	gameObject.light.transform.position = pos;
	gameObject.light.transform.LookAt(center);
}

//function Update() {
//	if(update) {
//		time += speed;
//		if(time>24) { time = 0; }
//	}
//	setTime();
//}
//
//function setTime() {
//	//transform.eulerAngles.y = angle;
//
//	var inc = time-lastTime;
//	var degrees:float = inc * 180 / 12;
//	gameObject.light.transform.RotateAround (center, Vector3(1,0,0), degrees);
//	gameObject.light.transform.LookAt(center);
//	lastTime = time;
//}
