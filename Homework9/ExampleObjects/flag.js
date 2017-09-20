/**
 * Created by Beite on 4/13/17.
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
    var texture = undefined;
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
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                ] },
                a_texcoord : {numComponents:3, data: new Float32Array([	
                    /*.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    
                    0,-1,0, 0,0,1, -1,0,0,         1,0,0, 0,1,0, 0,0,1,    
                    0,-1,0, 0,0,1, -1,0,0,         1,0,0, 0,1,0, 0,0,1,    
                    0,-1,0, 0,0,1, -1,0,0,         1,0,0, 0,1,0, 0,0,1,    
                    0,-1,0, 0,0,.5, -1,0,0,         .5,0,0, 0,.5,0, 0,0,0,     
										 
                    0,0,0, 0,0,0, 0,0,0,        0,0,0, 0,0,0, 0,0,0,                        
                    0,0,0, 0,0,0, 0,0,0,            
                    0,0,0, 0,0,0, 0,0,0,           
                    0,0,0, 0,0,0, 0,0,0,     0,0,0, 0,0,0, 0,0,0,    
                    0,0,0, 0,0,0, 0,0,0,     0,0,0, 0,0,0, 0,0,0, */    	
								
									0,0,0, .5,0, 0, .5,.5,0,  0,0,0, .5,.5,0, 0,.5,0,
									0,0,0, .5,0, 0, .5,.5,0,  0,0,0, .5,.5,0, 0,.5,0,
									0,0,0, 0,.5,0, .5,.5,0,     0,0,0, .5,.5,0, .5,0,0,	
									0,0,0, 0,.5,0, .5,.5,0,     0,0,0, .5,.5,0, .5,0,0,	
									0,0,0, 0,.5,0, .5,.5,0,     0,0,0, .5,.5,0, .5,0,0,	
									0,0,0, 0,.5,0, .5,.5,0,     0,0,0, .5,.5,0, .5,0,0,	
									
									.5,0,0, .5,1,0, 1,1,0,     .5,0,0, 1,1,0, 1,0,0,		
									.5,0,0, .75,1,0, 1,0,0,		.5,0,0, .75,1,0, 1,0,0,
									.5,0,0, .5,1,0, 1,1,0,     .5,0,0, 1,1,0, 1,0,0,				
									.5,0,0, .5,1,0, 1,1,0,     .5,0,0, 1,1,0, 1,0,0,	])},								
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
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

