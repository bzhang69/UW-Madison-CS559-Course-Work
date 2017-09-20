var vertexPos = new Float32Array(
		[  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
			 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
			 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
			-1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
			-1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
			 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);

// vertex colors
var vertexColors = new Float32Array(
		[  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
			 1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
			 0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
			 1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
			 1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
			 0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);

// vertex texture coordinates
var vertexTextureCoords = new Float32Array(
		[  0, 0,   1, 0,   1, 1,   0, 1,
			 1, 0,   1, 1,   0, 1,   0, 0,
			 0, 1,   0, 0,   1, 0,   1, 1,
			 0, 0,   1, 0,   1, 1,   0, 1,
			 1, 1,   0, 1,   0, 0,   1, 0,
			 1, 1,   0, 1,   0, 0,   1, 0 ]);

// element index array
var triangleIndices = new Uint8Array(
		[  0, 1, 2,   0, 2, 3,    // front
			 4, 5, 6,   4, 6, 7,    // right
			 8, 9,10,   8,10,11,    // top
			12,13,14,  12,14,15,    // left
			16,17,18,  16,18,19,    // bottom
		20,21,22,  20,22,23 ]); // back
				
var vertexNormals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, 
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  ]);					
			 
function getPos(){
	return vertexPos;
}					 

function getColors() {
	return vertexColors;
}

function getIndices() {
	return triangleIndices;
}

function getTexture() {
	return vertexTextureCoords;
}

function getNorm() {
	return vertexNormals;
}
