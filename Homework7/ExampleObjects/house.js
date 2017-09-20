/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var House = undefined;
var SpinningHouse = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Houses
    House = function House(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || [1.0,1.0,1.0];
        this.color = color || [.7,.8,.9];
    }
    House.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["house-vs", "house-fs"]);
        }
        if (!buffers) {
            var arrays = {
							
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,     // x = 1
										 
                    -.6,.5,-.6,  -.6,.5,.6,  .6, .5,.6,        -.6,.5,-.6, .6,.5,.6,  .6, .5,-.6,    // z = 0                    
                    -.6,.5,-.6,  -.6,.5,.6,  -.6, 1.0,0,            // y = 0
                    .6, .5,-.6,  .6, .5,.6,  .6, 1.0, 0,           // y = 1.0
                    -.6,.5,-.6, .6, .5 ,-.6,  .6,1.0, 0,        	-.6,.5,-.6, .6, 1.0, 0,  -.6,1.0,0,    // x = 0
                    -.6,.5,.6,  .6, .5,.6,  .6, 1.0, 0,         -.6,.5,.6,  .6, 1.0, 0,  -.6,1.0,0     // x = 1.0										 
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
										
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     1,0,0, 1,0,0, 1,0,0,
                    0,-1,-1, 0,-1,-1, 0,-1,-1,     0,-1,-1, 0,-1,-1, 0,-1,-1,	
                    0,1,1, 0,1,1, 0,1,1,     0,1,1, 0,1,1, 0,1,1,										

										
                ]},

                vcolor : {numComponents:3, data: [
                    //Front Face
									.5,0,0, .5,0,0, .5,0,0,     .5,0,0, .5,0,0, .5,0,0,		
									.5,0,0, .5,0,0, .5,0,0,     .5,0,0, .5,0,0, .5,0,0,	
									.5,0,0, .5,0,0, .5,0,0,     .5,0,0, .5,0,0, .5,0,0,	
									.5,0,0, .5,0,0, .5,0,0,     .5,0,0, .5,0,0, .5,0,0,		
									.5,0,0, .5,0,0, .5,0,0,     .5,0,0, .5,0,0, .5,0,0,	
									.5,0,0, .5,0,0, .5,0,0,     .5,0,0, .5,0,0, .5,0,0,
									
									.5,.8,.5, .5,.8,.5, .5,.8,.5,     .5,.8,.5, .5,.8,.5, .5,.8,.5,		
									.5,.8,.5, .5,.8,.5, .5,.8,.5,     .5,.8,.5, .5,.8,.5, .5,.8,.5,	
									.5,.8,.5, .5,.8,.5, .5,.8,.5,     .5,.8,.5, .5,.8,.5, .5,.8,.5,				
									.5,.8,.5, .5,.8,.5, .5,.8,.5,     .5,.8,.5, .5,.8,.5, .5,.8,.5,										
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    House.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size[0],this.size[1],this.size[2]]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    House.prototype.center = function(drawingState) {
        return this.position;
    }


    ////////
    // constructor for Houses
    SpinningHouse = function SpinningHouse(name, position, size, color, axis) {
        House.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningHouse.prototype = Object.create(House.prototype);
    SpinningHouse.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);

        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningHouse.prototype.center = function(drawingState) {
        return this.position;
    }


})();

grobjects.push(new House("House1",[-3,0.751,3],[3,1.5,2.5]) );

