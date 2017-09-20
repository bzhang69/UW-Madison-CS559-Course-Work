/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the dog is more complicated since it is designed to allow making many dogs

 we make a constructor function that will make instances of dogs - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all dogs - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each dog instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Dog = undefined;
var SpinningDog = undefined;
var m4 = twgl.m4;
// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all dogs - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Dogs
    Dog = function Dog(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Dog.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all dogs
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["dog-vs", "dog-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]},

                vcolor : {numComponents:3, data: [
									.5,.2,0, .5,.2,0, .5,.2,0,     .5,.2,0, .5,.2,0, .5,.2,0,		
									.5,.2,0, .5,.2,0, .5,.2,0,     .5,.2,0, .5,.2,0, .5,.2,0,	
									.5,.2,0, .5,.2,0, .5,.2,0,     .5,.2,0, .5,.2,0, .5,.2,0,	
									.5,.2,0, .5,.2,0, .5,.2,0,     .5,.2,0, .5,.2,0, .5,.2,0,		
									.5,.2,0, .5,.2,0, .5,.2,0,     .5,.2,0, .5,.2,0, .5,.2,0,	
									.5,.2,0, .5,.2,0, .5,.2,0,     .5,.2,0, .5,.2,0, .5,.2,0,														
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    var legs = [-.4,.3,-.4,.3];
    var rev = true;
    var checkPoint = 1;
    var movePos = 0;
    var speed = .01;
    Dog.prototype.draw = function(drawingState) {
        if(checkPoint == 1){
            movePos += speed;
            if(movePos >= 6.0){
                checkPoint = 2;
            }
        }
        if(checkPoint == 2){
            movePos -= speed;
            if(movePos <= 0){
                checkPoint = 1;
            }
        }

        // BODY
        var modelM = m4.scaling([1,.5,.5]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var moveModel = m4.multiply(modelM, m4.translation([0 + movePos,1, 0 + 0]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
					view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
					dogColor:[.5, 0.2, 0], model: moveModel });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        //HEAD
        var mode2M = m4.multiply(m4.scaling([.4,.8,.85]), moveModel);
        var mvHead = m4.multiply(mode2M,m4.translation([0.55,0.3,0]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
					view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
					dogColor:[.6,0.3,0.1], model: mvHead });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
				//Ears
        var mode2M = m4.multiply(m4.scaling([.1,.4,.4]), moveModel);
        var mvHead = m4.multiply(mode2M,m4.translation([0.6,0.5,-0.2]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
					view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
					dogColor:[.1,0.1,0.1], model: mvHead });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);				
				
        var mode2M = m4.multiply(m4.scaling([.1,.4,.4]), moveModel);
        var mvHead = m4.multiply(mode2M,m4.translation([0.6,0.5,0.2]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
					view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
					dogColor:[.1,0.1,0.1], model: mvHead });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);				
        //Legs 
        if(rev){
            legs[0] -=.015;
						legs[1] +=.012;
						legs[2] -=.011;
						legs[3] +=.013;						
        }else{
            legs[0] +=.015;
						legs[1] -=.012;
						legs[2] +=.011;
						legs[3] -=.013;							
        }
        if(legs[0] <= -.4){
            rev = false;
        }
        if(legs[0] >= .3){
            rev = true;
        }
        var moveL = m4.multiply(m4.multiply(m4.translation([legs[0],0,0]), m4.multiply(m4.scaling([.15,1.0,.25]), moveModel)),m4.translation([.30,-0.5,-.20]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            dogColor:[.3,0.1,0], model: moveL });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

        var moveR = m4.multiply(m4.multiply(m4.translation([legs[1],0,0]), m4.multiply(m4.scaling([.15,1.0,.25]), moveModel)),m4.translation([.30,-0.5,.20]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            dogColor:[.3,0.1,0], model: moveR });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
				
        var moveL2 = m4.multiply(m4.multiply(m4.translation([-legs[2],0,0]), m4.multiply(m4.scaling([.15,1.0,.25]), moveModel)),m4.translation([-.30,-0.5,-.20]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            dogColor:[.3,0.1,0], model: moveL2 });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

        var moveR2 = m4.multiply(m4.multiply(m4.translation([-legs[3],0,0]), m4.multiply(m4.scaling([.15,1.0,.25]), moveModel)),m4.translation([-.30,-0.5,.20]));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            dogColor:[.3,0.1,0], model: moveR2 });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Dog.prototype.center = function(drawingState) {
        return this.position;
    }
})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of dogs, just don't load this file.

grobjects.push(new Dog("Dog",[-2,-.2,0],1) );
