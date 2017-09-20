function start() { 
	"use strict";
	console.log('working');
	
	var canvas = document.getElementById('mycanvas');
	var gl = canvas.getContext('webgl');
	
	if(!gl) {
		gl = canvas.getContext('experimental-webgl');
	}
	if(!gl) {
		alert('Browser doesnt support WebGL');
	}
	
  var m4 = twgl.m4;	
	
	var slider1 = document.getElementById('slider1');
	slider1.value = 0;
	var slider2 = document.getElementById('slider2');
	slider2.value = 0;	
	var slider3 = document.getElementById('slider3');
	slider2.value = 1;		
	var slider4 = document.getElementById('slider4');
	slider4.value = 10.0;	

	var vertexShaderText = document.getElementById("vs").text;
	var fragmentShaderText = document.getElementById("fs").text;	
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('err', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('err', gl.getShaderInfoLog(fragmentShader));
		return;
	}	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('err', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	gl.useProgram(program);
	
	program.PositionAttribute = gl.getAttribLocation(program, "vPosition");
	gl.enableVertexAttribArray(program.PositionAttribute);
	
	program.ColorAttribute = gl.getAttribLocation(program, "vColor");
	gl.enableVertexAttribArray(program.ColorAttribute);    
	
	program.texcoordAttribute = gl.getAttribLocation(program, "vTexCoord");
	gl.enableVertexAttribArray(program.texcoordAttribute);		
	
	program.NormalAttribute = gl.getAttribLocation(program, "vNormal");
	gl.enableVertexAttribArray(program.NormalAttribute);		
	
	program.MVPmatrix = gl.getUniformLocation(program,"uMVP");

	program.texcoordAttribute = gl.getAttribLocation(program, "vTexCoord");
	gl.enableVertexAttribArray(program.texcoordAttribute);
	
	program.MVmatrix = gl.getUniformLocation(program,"uMV");
	program.MVNormalmatrix = gl.getUniformLocation(program,"uMVn");
	program.MVPmatrix = gl.getUniformLocation(program,"uMVP");
	var locationOfComp = gl.getUniformLocation(program, "comp");
			
	var vertexPos = getPos();
	var vertexColors = getColors();
	var vertexTextureCoords = getTexture();
	var triangleIndices = getIndices();
	var vertexNormals = getNorm();	
	
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 24;	
	
	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
	colorBuffer.itemSize = 3;
	colorBuffer.numItems = 24;	
	
	var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
	textureBuffer.itemSize = 2;
	textureBuffer.numItems = 24;
		
	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);  
	
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(program.texcoordAttribute, textureBuffer.itemSize,
	gl.FLOAT, false, 0, 0);	
	
	var triangleNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
	triangleNormalBuffer.itemSize = 3;
	triangleNormalBuffer.numItems = 24;	
	
	
	function draw() {
		
    var angle1 = slider1.value*0.01*Math.PI;
    var angle2 = slider2.value*0.01*Math.PI;
    var angle3 = slider3.value*0.03;
    var eye=[500*Math.cos(angle1),300*Math.cos(angle2),500*Math.sin(angle1)];
		var target = [0,40,0];
		var up = [0,1,0];

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.enable(gl.DEPTH_TEST);	
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		//
		var tProjection = m4.perspective(Math.PI/4*angle3,1,10,1000);
		var tCamera = m4.inverse(m4.lookAt(eye,target,up));
		var tModel = m4.multiply(m4.scaling([100,100,100]),m4.axisRotation([1,1,1],angle2));   
		var tMVP=m4.multiply(m4.multiply(tModel,tCamera),tProjection);
		var tnModel = m4.axisRotation([1,1,1],angle2);
		var tMV=m4.multiply(tModel,tCamera);
		var tMVn=m4.multiply(tnModel,tCamera);
		
		gl.uniformMatrix4fv(program.MVPmatrix,false,tMVP);
			 
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.vertexAttribPointer(program.ColorAttribute, colorBuffer.itemSize,
		gl.FLOAT,false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program.PositionAttribute, vertexBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(program.MVmatrix,false,tMV);
		gl.uniformMatrix4fv(program.MVNormalmatrix,false,tMVn);
		gl.uniformMatrix4fv(program.MVPmatrix,false,tMVP);
					 
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
		gl.vertexAttribPointer(program.NormalAttribute, triangleNormalBuffer.itemSize,
		gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.vertexAttribPointer(program.texcoordAttribute, textureBuffer.itemSize,
		gl.FLOAT, false, 0, 0);			
		gl.uniform1f(locationOfComp, slider4.value);	

	// Do the drawing
	gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);		
  window.requestAnimationFrame(draw);

	}
  draw();
}