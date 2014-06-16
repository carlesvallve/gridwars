#pragma strict

//lacunarity:1.837857 h:0.4 octaves:3.034253 scale:0.01455721 offset:0.1800193

class CubeGenerator extends MonoBehaviour {

	public var width:int = 32;
	public var height:int = 32;

	public var materialName = 'terrain'; // 'grid';

	public function init () {
		createCubeMesh();
	}


	// ---------------------------------------------------------
	// Generate Terrain Mesh


	public function createCubeMesh() {
		var mesh:Mesh = gameObject.AddComponent(MeshFilter).mesh;
		setMeshVertices(mesh);
		setMeshTriangles(mesh);
		updateMesh(mesh);
	}

	public function initCubeMesh() {
		var mesh:Mesh = gameObject.GetComponent(MeshFilter).mesh;
		setMeshVertices(mesh);
		updateMesh(mesh);
	}


	private function setMeshVertices(mesh:Mesh): void {
		// build vertices and UVs and tangents
		var vertices = new Vector3[height * width];
		var uv = new Vector2[height * width];
		var tangents = new Vector4[height * width];

		var uvScale = Vector2 (1.0 / (width - 1), 1.0 / (height - 1));

		var scale = 1; var altitude = 1;
		var sizeScale = Vector3 (scale, altitude * scale, scale);

		for (var y:int = 0; y< height - 0; y++) {
			for (var x:int = 0; x< width - 0; x++) {
				// get pixel data from heightmap
				var pixelHeight = 1; //heightmap.GetPixel(x, y).grayscale;
				var pixelL = 1; //heightmap.GetPixel(x-1, y).grayscale;
				var pixelR = 1; //heightmap.GetPixel(x+1, y).grayscale;

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


//		var a = 0; var d = 0.5; var h = 3.0;
//
//       	var vertices = [Vector3(-d, a, -d), Vector3(-d, h, -d), Vector3(d, h, -d), Vector3(d, a, -d),  //front
//                           Vector3(d, a, d), Vector3(d, h, d), Vector3(-d, h, d), Vector3(-d, a, d),  //back
//                           Vector3(d, a, -d), Vector3(d, h, -d), Vector3(d, h, d), Vector3(d, a, d),  //right
//                           Vector3(-d, a, d), Vector3(-d, h, d), Vector3(-d, h, -d), Vector3(-d, a, -d),  //left
//                           Vector3(-d, h, -d), Vector3(-d, h, d), Vector3(d, h, d), Vector3(d, h, -d),  //top
//                           Vector3(-d, a, -d), Vector3(-d, a, d), Vector3(d, a, d), Vector3(d, a, -d)]; //bottom
//
//		mesh.vertices = vertices;
//
//		mesh.uv = [Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
//                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
//                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
//                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
//                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0),
//                     Vector2(0, 0),    Vector2(0, 1),    Vector2(1, 1),    Vector2 (1, 0)];

//       	mesh.triangles = [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23];
//
//       	mesh.normals = [Vector3( 0, 0,-1),Vector3( 0, 0,-1),Vector3( 0, 0,-1),Vector3( 0, 0,-1),  //front
//                          Vector3( 0, 0, 1),Vector3( 0, 0, 1),Vector3( 0, 0, 1),Vector3( 0, 0, 1),  //back
//                          Vector3( 1, 0, 0),Vector3( 1, 0, 0),Vector3( 1, 0, 0),Vector3( 1, 0, 0),  //right
//                          Vector3(-1, 0, 0),Vector3(-1, 0, 0),Vector3(-1, 0, 0),Vector3(-1, 0, 0),  //left
//                          Vector3( 0, 1, 0),Vector3( 0, 1, 0),Vector3( 0, 1, 0),Vector3( 0, 1, 0),  //top
//                          Vector3( 0,-1, 0),Vector3( 0,-1, 0),Vector3( 0,-1, 0),Vector3( 0,-1, 0)]; //bottom


//		mesh.RecalculateNormals();
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
		//paintSlopes(width, height);
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
		var scale = 1;
		go.renderer.material.SetTextureScale("_MainTex", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
		go.renderer.material.SetTextureScale("_MainTex2", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
		go.renderer.material.SetTextureScale("_MainTex3", new Vector2((width-1) * scale / 9.0, (height-1) * scale / 9.0));
		go.renderer.material.SetTextureScale("_MainTex4", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
		go.renderer.material.SetTextureScale("_BumpMap", new Vector2((width-1) * scale / 3.0, (height-1) * scale / 3.0));
	}


    // ---------------------------------------------------------
	// Make Cube Example


	public function makeCube (go:GameObject, h:float) {

		var mf:MeshFilter = go.GetComponent("MeshFilter");
		if(!mf) {
			mf = go.AddComponent("MeshFilter");
		}

		var mesh2:Mesh = mf.mesh;
		mesh2.Clear();

		var size = 1;

		var d = 0.5;

		//var pos = Vector2(go.transform.position.x, go.transform.position.z);

//		var x:int = go.transform.position.x;
//		var y:int = go.transform.position.z;
//		var pixelHeight = heightmap.GetPixel(x, y).grayscale;


		//var sizeScale = Vector3 (scale, altitude * scale, scale);
		//var b = -10; //pixelHeight * sizeScale.y; //mesh.vertices[]

		var mesh:Mesh = gameObject.GetComponent(MeshFilter).mesh;
		var a = -1.0;

       	var vertices = [Vector3(-d, a, -d), Vector3(-d, h, -d), Vector3(d, h, -d), Vector3(d, a, -d),  //front
                           Vector3(d, a, d), Vector3(d, h, d), Vector3(-d, h, d), Vector3(-d, a, d),  //back
                           Vector3(d, a, -d), Vector3(d, h, -d), Vector3(d, h, d), Vector3(d, a, d),  //right
                           Vector3(-d, a, d), Vector3(-d, h, d), Vector3(-d, h, -d), Vector3(-d, a, -d),  //left
                           Vector3(-d, h, -d), Vector3(-d, h, d), Vector3(d, h, d), Vector3(d, h, -d),  //top
                           Vector3(-d, a, -d), Vector3(-d, a, d), Vector3(d, a, d), Vector3(d, a, -d)]; //bottom



//        var v;
//        var v1 =  mesh.vertices[(y + 0)*width + (x + 0)];//.y;
//        vertices[0].y =  v1.y + go.transform.position.y - 0.5 + h / 1;// + 0.75;
//
//
//        var v2 = mesh.vertices[(y)*width + (x + 1)];//.y;
//        vertices[3].y = v2.y + go.transform.position.y + 0.5 + h / 1;// + 0.75;

        //vertices[4].y = mesh.vertices[(y + 0)*width + (x + 0)].y - go.transform.position.y + h / 2 + 1.0;
        //vertices[7].y = mesh.vertices[(y + 0)*width + (x + 0)].y - go.transform.position.y + h / 2 + 1.0;


        //vertices[8] = Vector3(-d, mesh.vertices[(y)*width + (x + 1)].y, -d);

        //print (v1 + ' ' + v2);

        //vertices[4] = Vector3(-d, mesh.vertices[(y)*width + (x + 0)].y, -d);
        //vertices[7] = Vector3(-d, mesh.vertices[(y)*width + (x + 1)].y, -d);


//		for (var v in vertices) {
//		}



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


}
