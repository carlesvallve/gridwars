#pragma strict

//lacunarity:1.837857 h:0.4 octaves:3.034253 scale:0.01455721 offset:0.1800193

class TerrainGenerator extends MonoBehaviour {

	public var width:int = 32;
	public var height:int = 32;
	public var altitude:int = 10;
	public var scale:float = 1.0;
	public var useTerraces:boolean = false;
	var heightmap:Texture2D;

	public var materialName = 'terrain'; // 'grid';

	var terrainMesh:Mesh;
	var cubeMesh:Mesh;


	public function init (w, h) {
		width = w;
		height = h;
		// generate base plane
		initPlane();
		createRandomTerrain();
	}


	private function generateHeightmap(size:Vector3): Texture2D {
		// create a new heightmap texture
		var heightmap = new Texture2D(size.x, size.z, TextureFormat.RGB24, false);

		// init parameters
//		var lacunarity = Random.Range(1.0,2.0); //1.0; //2.404;
//		var h = Random.Range(0.4,0.4); //0.2; //0.354;
//		var gain = Random.Range(0.1, 1.0); //3.5; //1.0;
//		var octaves = Random.Range(1.0, 8.0); //3.5; //2.315;
//		var offset = Random.Range(0.0, 0.2); //0.0; //0.245;
//		var scale = Random.Range(0.01,0.04); //0.1; //Random.Range(0.01,0.08); //0.05; //0.053;

		var lacunarity = Random.Range(1.0,2.0); //1.0; //2.404;
		var h = Random.Range(0.4,0.4); //0.2; //0.354;
		var gain = Random.Range(0.1, 1.0); //3.5; //1.0;
		var octaves = Random.Range(1.0, 8.0); //3.5; //2.315;
		var offset = Random.Range(0.0, 0.2); //0.0; //0.245;
		var scale = Random.Range(0.01,0.04); //0.1; //Random.Range(0.01,0.08); //0.05; //0.053;053

		var precision = 80; //Random.Range(30,60);
		var terraces = [ .4, .8, .12, .16, .20];

		var offsetPos = 0.0;
		var timeaddx:float=0; //0.005;
		var timeaddy:float=0;
		var mytimex:float=0.0;
		var mytimey:float=0.0;

		//lacunarity = 1.909066; h = 0.4; octaves = 6.861938; scale = 0.01044309; offset = 0.03951747;

		//h = -0.4; 
		offset = 0.0;
		print('lacunarity:' + lacunarity + ' h:' + h + ' octaves:' + octaves + ' scale:' + scale + ' offset:' + offset);

		// init perlin and fractal noise
		var perlin : Perlin = new Perlin();
		var fractal : FractalNoise = new FractalNoise(h, lacunarity, octaves, perlin);

		// paint pixels
		for (var y = 0; y < size.z; y++)	{
			for (var x = 0; x < size.x; x++)	{
				// value
				var xvalue:float = Mathf.Floor((x * scale) * precision) / precision;
				var yvalue:float = Mathf.Floor((y * scale) * precision) / precision;
				//var value:float = fractal.RidgedMultifractal(xvalue, yvalue, offset, gain) * 5;
				var value:float = fractal.HybridMultifractal(xvalue, yvalue, offset) * 1;
				// terraces
				if(useTerraces) {
					for(var n =0; n<terraces.length; n++) { //in terraces) {
						var terrace = terraces[n];
						if(value > terrace && value < terrace + 0.075) {
							value = terrace;
						}
					}
				}

				// paint pixel value
				heightmap.SetPixel(x, y, Color (value, value, value, 1));
			}
		}

		// apply pixels to texture
		heightmap.Apply();

		//return generated heightmap texture
		return heightmap;
	}


	// ---------------------------------------------------------
	// Generate Terrain Mesh


	public function createRandomTerrain() {
		heightmap = generateHeightmap(Vector3(width,30,height)); 
		var mesh:Mesh = gameObject.AddComponent(MeshFilter).mesh;
		setMeshVertices(mesh);
		setMeshTriangles(mesh);
		updateMesh(mesh);

		this.terrainMesh = mesh;
	}

	public function initRandomTerrain() {
		heightmap = generateHeightmap(Vector3(width,30,height)); 
		var mesh:Mesh = gameObject.GetComponent(MeshFilter).mesh;
		setMeshVertices(mesh);
		updateMesh(mesh);

		this.terrainMesh = mesh;
	}



	private function updateMesh(mesh:Mesh): void {
		//optimize framerate at cost of increasing creation time
	    mesh.Optimize();

	    // auto-calculate vertex normals from the mesh
		mesh.RecalculateNormals();

	    //update mesh collider
	    var mc:MeshCollider = gameObject.GetComponent('MeshCollider') as MeshCollider;
	    if(mc) {
	    	mc.sharedMesh = null;
			mc.sharedMesh = mesh;
	    } else {
	    	mc = gameObject.AddComponent("MeshCollider");
	    }

	    // set mesh material and textures
		initMaterial(gameObject, materialName, true);

		// set texture
		paintSlopes(width, height);	
	}


	private function setMeshVertices(mesh:Mesh): void {
		// build vertices and UVs and tangents
		var vertices = new Vector3[height * width];
		var uv = new Vector2[height * width];
		var tangents = new Vector4[height * width];

		var uvScale = Vector2 (1.0 / (width - 1), 1.0 / (height - 1));
		var sizeScale = Vector3 (scale, altitude * scale, scale);

		for (var y:int = 0; y< height - 0; y++) {
			for (var x:int = 0; x< width - 0; x++) {
				// get pixel data from heightmap
				var pixelHeight = heightmap.GetPixel(x, y).grayscale;
				var pixelL = heightmap.GetPixel(x-1, y).grayscale;
				var pixelR = heightmap.GetPixel(x+1, y).grayscale;

				// reset perimeter
				if(x == 0 || y == 0 || x == width - 1 || y == height - 1) {
					pixelHeight = -0.1; pixelL = -0.1; pixelR = -0.1;
				}

				// create vertices and uv
				var vertex = Vector3 (x, pixelHeight, y);
				vertices[y*width + x] = Vector3.Scale(sizeScale, vertex);
				uv[y*width + x] = Vector2.Scale(Vector2 (x, y), uvScale);

				// Calculate tangent vector: a vector that goes from previous vertex
				// to next along X direction. We need tangents if we intend to
				// use bumpmap shaders on the mesh.
				var vertexL = Vector3( x-1, pixelL, y );
				var vertexR = Vector3( x+1, pixelR, y );
				var tan = Vector3.Scale( sizeScale, vertexR - vertexL ).normalized;
				tangents[y*width + x] = Vector4( tan.x, tan.y, tan.z, -1.0 );
			}
		}

		// assign them to the mesh
		mesh.vertices = vertices;
		mesh.uv = uv;

		mesh.tangents = tangents;
	}


	private function setMeshTriangles (mesh:Mesh): void {
		// build triangle indices: 3 indices into vertex array for each triangle
		var triangles = new int[(height - 1) * (width - 1) * 6];
		var index = 0;
		for (var y:int = 0; y< height - 1; y++) {
			for (var x:int = 0; x< width - 1; x++) {
				// for each grid cell output two triangles
				triangles[index++] = (y     * width) + x;
				triangles[index++] = ((y+1) * width) + x;
				triangles[index++] = (y     * width) + x + 1;
				//
				triangles[index++] = ((y+1) * width) + x;
				triangles[index++] = ((y+1) * width) + x + 1;
				triangles[index++] = (y     * width) + x + 1;
			}
		}

		// and assign them to the mesh
		mesh.triangles = triangles;
	}


	// ---------------------------------------------------------
	// Generate Material

	private function initMaterial (go:GameObject, pathMaterial:String, shadows:boolean) {
		// create a mesh renderer
		var mc:MeshRenderer = go.GetComponent("MeshRenderer");
		if(!mc) {
			mc = go.AddComponent("MeshRenderer");
		}

		go.renderer.receiveShadows = shadows;
		go.renderer.castShadows = shadows;

		//print('initMaterial:' + go);

		// assign given material
		go.renderer.material = Resources.Load('prefabs/terrain/materials/' + pathMaterial); //terrain");
		//print('assigning material... ' + go.renderer.material);

		// Adjust texture sizes to terrain size
		go.renderer.material.SetTextureScale("_MainTex", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
		go.renderer.material.SetTextureScale("_MainTex2", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
		go.renderer.material.SetTextureScale("_MainTex3", new Vector2((width-1) * scale / 9.0, (height-1) * scale / 9.0));
		go.renderer.material.SetTextureScale("_MainTex4", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
		go.renderer.material.SetTextureScale("_BumpMap", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));	
	}


	// ---------------------------------------------------------
	// Generate Texture

	private function paintSlopes(width:int, height:int):void {
		var maxSlope:float = 0.98; // 0.95
		var waterLevel:float = 0; //0.25;

	    // get size
	    var size:Vector3  = new Vector3(width-1, altitude*.1, height-1);

	    // create new rgba mask texture
        var tex:Texture2D = new Texture2D(width - 1, height - 1, TextureFormat.ARGB32, false); //ARGB32



	    //iterate on grid cells
	    for(var x:int = 0; x < size.x; x++){
		    for(var y:int = 0; y < size.z; y++){
				//vertical raycast on each cell's position
				var p:Vector3 = new Vector3(.5 + x,32, .5 + y);
				var ray:Ray = new Ray (p, -Vector3.up); 
                var hit:RaycastHit = new RaycastHit() ;
				if (Physics.Raycast (ray, hit, 1000)) { //out 
					//get cell slope
					var proj:Vector3 = Vector3.forward - (Vector3.Dot(Vector3.forward, hit.normal)) * hit.normal;
					var rot:Quaternion = Quaternion.LookRotation(proj, hit.normal);
					var slope:float = rot.w;
					//set cell texture
					if(slope >= maxSlope){
						tex.SetPixel(x, y, Color(0, 0, 0, 0)); // Color.black); //field //red
					}else{
						tex.SetPixel(x, y, Color(255, 255, 255, 1)); // )Color.white); //slope // green
					}
//					if(hit.point.y <= waterLevel) {
//						tex.SetPixel(x,y , Color.blue); //water
//					}
				}

		    }
	    }


		// re-paint alpha with a gray value
		var pixels : Color[] = tex.GetPixels();
        for (var i : int = 0; i< pixels.Length; ++i) { 
        	var pixel = pixels[i]; 
    		pixel.a = (pixel.r + pixel.g + pixel.b) / 3.0f; 
        	tex.SetPixels(pixels);
        }

	    //apply mask texture
	    tex.Apply();

	    //renderer.material.SetTexture(" _MainTex",tex);
	    renderer.material.SetTexture("_Mask",tex); 
    }


    // ---------------------------------------------------------
	// Generate Base Plane with inverted normals

	private function initPlane(): void {
		// set dimensions
		var width:int = width - 1;
		var height:int = height - 1;

		// create plane
		var plane:GameObject = new GameObject('Plane');
		plane.transform.position = Vector3(0, -1.2, 0);

		// create  mesh 
		var mf: MeshFilter = plane.AddComponent(MeshFilter);
		var mesh:Mesh = mf.mesh;

		// vertices
		var vertices: Vector3[] = new Vector3[4];
		vertices[0] = new Vector3(0, 0, 0);
		vertices[1] = new Vector3(width, 0, 0);
		vertices[2] = new Vector3(0, 0, height);
		vertices[3] = new Vector3(width, 0, height);
		mesh.vertices = vertices;

		// triangles
		var tri: int[] = new int[6];
		tri[0] = 0;
		tri[1] = 2;
		tri[2] = 1;
		tri[3] = 2;
		tri[4] = 3;
		tri[5] = 1;
		mesh.triangles = tri;

		// reversed normals
		var normals: Vector3[] = new Vector3[4];
		normals[0] = -Vector3.forward;
		normals[1] = -Vector3.forward;
		normals[2] = -Vector3.forward;
		normals[3] = -Vector3.forward;
		mesh.normals = normals;

		reverseNormals(mesh);

		// uv
		var uv: Vector2[] = new Vector2[4];
		uv[0] = new Vector2(0, 0);
		uv[1] = new Vector2(1, 0);
		uv[2] = new Vector2(0, 1);
		uv[3] = new Vector2(1, 1);
		mesh.uv = uv;

		// set mesh material and textures
		initMaterial(plane, 'grid', true);
	}


	private function reverseNormals (mesh:Mesh): void {
		// reverse normals
		var normals:Vector3[] = mesh.normals;
		for (var i:int = 0; i<normals.length; i++) { 
			normals[i] = -normals[i]; 
		}
		mesh.normals = normals;

		// reverse triangles
		for (var m:int  = 0; m< mesh.subMeshCount; m++) {
			var triangles:int[] = mesh.GetTriangles(m);
			for (i = 0; i < triangles.length; i+=3) {
				var temp:int  = triangles[i + 0];
				triangles[i + 0] = triangles[i + 1];
				triangles[i + 1] = temp;
			}
			mesh.SetTriangles(triangles, m);
		}
	}


	// ---------------------------------------------------------
	// Destroy terrain

    //private function destroy() {
		// Kills the game object
		//Destroy (gameObject);

		// Removes this script instance from the game object
		//Destroy (this);

		// Removes the rigidbody from the game object
		//Destroy (rigidbody);

		// Kills the game object in 5 seconds after loading the object
		//Destroy (gameObject, 5);
	//}


	public function makeCube (go:GameObject, h:float) {

		var mf:MeshFilter = go.GetComponent("MeshFilter");
		if(!mf) {
			mf = go.AddComponent("MeshFilter");
		}

		var mesh2:Mesh = mf.mesh;
		mesh2.Clear();

		var d = 0.5; var a = 0; h = 1;

		var mesh:Mesh = gameObject.GetComponent(MeshFilter).mesh;

       	var vertices = [Vector3(-d, a, -d), Vector3(-d, h, -d), Vector3(d, h, -d), Vector3(d, a, -d),  //front
                           Vector3(d, a, d), Vector3(d, h, d), Vector3(-d, h, d), Vector3(-d, a, d),  //back
                           Vector3(d, a, -d), Vector3(d, h, -d), Vector3(d, h, d), Vector3(d, a, d),  //right
                           Vector3(-d, a, d), Vector3(-d, h, d), Vector3(-d, h, -d), Vector3(-d, a, -d),  //left
                           Vector3(-d, h, -d), Vector3(-d, h, d), Vector3(d, h, d), Vector3(d, h, -d),  //top
                           Vector3(-d, a, -d), Vector3(-d, a, d), Vector3(d, a, d), Vector3(d, a, -d)]; //bottom

		mesh2.vertices = vertices;

		mesh2.uv = [Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0)];

       	mesh2.triangles = [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23];

       	mesh2.normals = [Vector3( 0, 0,-1),Vector3( 0, 0,-1),Vector3( 0, 0,-1),Vector3( 0, 0,-1),  //front
                          Vector3( 0, 0, 1),Vector3( 0, 0, 1),Vector3( 0, 0, 1),Vector3( 0, 0, 1),  //back
                          Vector3( 1, 0, 0),Vector3( 1, 0, 0),Vector3( 1, 0, 0),Vector3( 1, 0, 0),  //right
                          Vector3(-1, 0, 0),Vector3(-1, 0, 0),Vector3(-1, 0, 0),Vector3(-1, 0, 0),  //left
                          Vector3( 0, 1, 0),Vector3( 0, 1, 0),Vector3( 0, 1, 0),Vector3( 0, 1, 0),  //top
                          Vector3( 0,-1, 0),Vector3( 0,-1, 0),Vector3( 0,-1, 0),Vector3( 0,-1, 0)]; //bottom

		mesh2.RecalculateNormals();

		// Adjust texture sizes to cube size
		//var v:Vector2 = Vector2(0.333, 0.333);
		//go.renderer.material.SetTextureScale("_MainTex", v);
		//go.renderer.material.SetTextureScale("_MainTex2", v);
		//go.renderer.material.SetTextureScale("_BumpMap", v);	
	}


	public function adjustCube (go:GameObject, h:float) {
		var mesh:Mesh = (go.GetComponent("MeshFilter") as MeshFilter).mesh;

		var vertices = mesh.vertices;

		for (var v:Vector3 in vertices) {
        	var x = go.transform.position.x + v.x;
        	var z = go.transform.position.z + v.z;

        	for (var tv:Vector3 in terrainMesh.vertices) {
				// set lower vertices
				if (v.y <= 0) {
					if(tv.x == x && tv.z == z) {
						var y = tv.y - go.transform.position.y; // + 0.1;
	        			v.y = y;
	        			break;
	        		}
        		// set upper vertices
        		} else {
        			v.y = h > tv.y ? h : tv.y + 0.5; // y + h;
        		}
        	}

		}

		mesh.vertices = vertices;
	}


	public static function combineMesh (obj:GameObject) {
		var meshFilters = obj.GetComponentsInChildren(MeshFilter);
		var combine : CombineInstance[] = new CombineInstance[meshFilters.length];

		var i = 0;
		for (var mf : MeshFilter in meshFilters) {;
			combine[i].mesh = mf.sharedMesh; 
			combine[i].transform = mf.transform.localToWorldMatrix;
			mf.gameObject.SetActive(true); //active = true;
			i++;
		}

		var mesh:Mesh = obj.transform.GetComponent(MeshFilter).mesh;
		//var mesh:Mesh = new Mesh();
		//obj.transform.GetComponent(MeshFilter).mesh = mesh;

		// combine meshes
		mesh.CombineMeshes(combine);
		obj.transform.gameObject.SetActive(true); //active = true;

		// update mesh collider
		var mc:MeshCollider = obj.GetComponent('MeshCollider') as MeshCollider;
	    if(mc) {
	    	mc.sharedMesh = null;
			mc.sharedMesh = mesh;	
		} else {
			mc = obj.AddComponent('MeshCollider');
			mc.sharedMesh = mesh;	
		}

		obj.renderer.enabled = false;

		// set collider layer
		obj.layer = LayerMask.NameToLayer('Terrain');
	}

}
