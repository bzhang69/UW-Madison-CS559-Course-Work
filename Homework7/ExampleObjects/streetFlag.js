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
var Flag = undefined;
var SpinningFlag = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Flags
    Flag = function Flag(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || [1.0,1.0,1.0];
        this.color = color || [.7,.8,.9];
    }
    Flag.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["flag-vs", "flag-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.05,-1.05,-.05,  .05,-1.05,-.05,  .05, 1.05,-.05,        -.05,-1.05,-.05,  .05, 1.05,-.05, -.05, 1.05,-.05,    // z = 0
                    -.05,-1.05, .05,  .05,-1.05, .05,  .05, 1.05, .05,        -.05,-1.05, .05,  .05, 1.05, .05, -.05, 1.05, .05,    // z = 1
                    -.05,-1.05,-.05,  .05,-1.05,-.05,  .05,-1.05, .05,        -.05,-1.05,-.05,  .05,-1.05, .05, -.05,-1.05, .05,    // y = 0
                    -.05, 1.05,-.05,  .05, 1.05,-.05,  .05, 1.05, .05,        -.05, 1.05,-.05,  .05, 1.05, .05, -.05, 1.05, .05,    // y = 1
                    -.05,-1.05,-.05, -.05, 1.05,-.05, -.05, 1.05, .05,        -.05,-1.05,-.05, -.05, 1.05, .05, -.05,-1.05, .05,    // x = 0
                     .05,-1.05,-.05,  .05, 1.05,-.05,  .05, 1.05, .05,         .05,-1.05,-.05,  .05, 1.05, .05,  .05,-1.05, .05,     // x = 1
										 
                    -.08,1-.08,-.08,  .08,1-.08,-.08,  .08,1+.08,-.08,        -.08,1-.08,-.08,  .08,1+.08,-.08, -.08,1+.08,-.08,    // z = 0
                    -.08,1-.08, .08,  .08,1-.08, .08,  .08,1+.08, .08,        -.08,1-.08, .08,  .08,1+.08, .08, -.08,1+.08, .08,    // z = 1
                    -.08,1-.08,-.08,  .08,1-.08,-.08,  .08,1-.08, .08,        -.08,1-.08,-.08,  .08,1-.08, .08, -.08,1-.08, .08,    // y = 0
                    -.08,1+.08,-.08,  .08,1+.08,-.08,  .08,1+.08, .08,        -.08,1+.08,-.08,  .08,1+.08, .08, -.08,1+.08, .08,    // y = 1
                    -.08,1-.08,-.08, -.08,1+.08,-.08, -.08,1+.08, .08,        -.08,1-.08,-.08, -.08,1+.08, .08, -.08,1-.08, .08,    // x = 0
                     .08,1-.08,-.08,  .08,1+.08,-.08,  .08,1+.08, .08,         .08,1-.08,-.08,  .08,1+.08, .08,  .08,1-.08, .08,     // x = 1
										 
                    1.08,0.3,0,  0,0.3,0,  0,1-.08,0,        1.08,0.3,0,  1.08,1-.08,0,  0,1-.08,0,									
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
										
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,

                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,								
                ]},

                vcolor : {numComponents:3, data: [
                    //Front Face
									.8,.8,.8, .8,.8,.8, .8,.8,.8,     .8,.8,.8, .8,.8,.8, .8,.8,.8,		
									.8,.8,.8, .8,.8,.8, .8,.8,.8,     .8,.8,.8, .8,.8,.8, .8,.8,.8,	
									.8,.8,.8, .8,.8,.8, .8,.8,.8,     .8,.8,.8, .8,.8,.8, .8,.8,.8,	
									.8,.8,.8, .8,.8,.8, .8,.8,.8,     .8,.8,.8, .8,.8,.8, .8,.8,.8,		
									.8,.8,.8, .8,.8,.8, .8,.8,.8,     .8,.8,.8, .8,.8,.8, .8,.8,.8,	
									.8,.8,.8, .8,.8,.8, .8,.8,.8,     .8,.8,.8, .8,.8,.8, .8,.8,.8,
									
									.5,.5,0, .5,.5,0, .5,.5,0,     .5,.5,0, .5,.5,0, .5,.5,0,		
									.5,.5,0, .5,.5,0, .5,.5,0,     .5,.5,0, .5,.5,0, .5,.5,0,	
									.5,.5,0, .5,.5,0, .5,.5,0,     .5,.5,0, .5,.5,0, .5,.5,0,	
									.5,.5,0, .5,.5,0, .5,.5,0,     .5,.5,0, .5,.5,0, .5,.5,0,		
									.5,.5,0, .5,.5,0, .5,.5,0,     .5,.5,0, .5,.5,0, .5,.5,0,	
									.5,.5,0, .5,.5,0, .5,.5,0,     .5,.5,0, .5,.5,0, .5,.5,0,			

									.1,.1,.8, .1,.1,.8, .1,.1,.8,     .1,.1,.8, .1,.1,.8, .1,.1,.8,									
                ]}
            };					
						
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Flag.prototype.draw = function(drawingState) {
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
    Flag.prototype.center = function(drawingState) {
        return this.position;
    }



})();


grobjects.push(new Flag("cube1",[-3.1,1.06,-0.1],[1,1,1],[1.0,0,0]) );
