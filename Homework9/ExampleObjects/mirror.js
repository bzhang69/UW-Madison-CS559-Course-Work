var grobjects = grobjects || [];
var mirror = undefined;

(function () {
    "use strict";
		
    var shaderProgram = undefined;
    var frameBuffer = undefined;
    var buffers = undefined;
    var index = 0;
    var previousMirror = undefined;

    mirror = function (position, front, up) {
        this.name = "mirror" + index++;
        this.position = position || [0, 1, 0];
        this.front = twgl.v3.normalize(front) || [1, 0, 0];
        this.up = up || [0, 1, 0];
        this.doubleRender = true;
    };
    var trans = function (front) {
        return [1 - 2 * front[0] * front[0], -2 * front[0] * front[1], -2 * front[0] * front[2],
				0, -2 * front[0] * front[1], 1 - 2 * front[1] * front[1], -2 * front[1] * front[2],
				0, -2 * front[0] * front[2], -2 * front[1] * front[2], 1 - 2 * front[2] * front[2],
				0, 0, 0, 0, 1];
    };

    mirror.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["mirror-vs", "mirror-fs"]);
        }
        if (!buffers) {
            var arrays = twgl.primitives.createPlaneVertices(3, 3);
            var mirror = {vpos: arrays.position, indices: arrays.indices};
            buffers = twgl.createBufferInfoFromArrays(gl, mirror);
        }
        if (!frameBuffer) {
            frameBuffer = twgl.createFramebufferInfo(gl);
        }
        this.pair = previousMirror;
        if (!previousMirror) {
            previousMirror = this;
        } else {
            previousMirror.pair = this;
            previousMirror = undefined;
            this.updatePos();
        }
    };

    mirror.prototype.updatePos = function () {
        var selfAt = twgl.v3.add(this.position, this.front);
        this.trans = twgl.m4.lookAt(this.position, selfAt, this.up);
        var pairAt = twgl.v3.add(this.pair.position, this.pair.front);
        this.pair.trans = twgl.m4.lookAt(this.pair.position, pairAt, this.pair.up);

        var mirror = trans(this.front);
        this.toPair = twgl.m4.multiply(twgl.m4.inverse(this.trans), mirror);
        twgl.m4.multiply(this.toPair, this.pair.trans, this.toPair);
        var pairMirror = trans(this.pair.front);
        this.pair.toPair = twgl.m4.multiply(twgl.m4.inverse(this.pair.trans), pairMirror);
        twgl.m4.multiply(this.pair.toPair, this.trans, this.pair.toPair);
    };

    mirror.prototype.draw = function (drawingState) {
        if (Math.random() < 0.0005) {
            for (var i = 0; i < 3; i++) {
                this.position[i] = (Math.random() - 0.5) * 10;
                this.front[i] += (Math.random() - 0.5);
                this.up[i] += (Math.random() - 0.5);
            }
            this.position[1] = Math.abs(this.position[1]);
            twgl.v3.normalize(this.front, this.front);
        }
        var gl = drawingState.gl;
        var storeView = drawingState.view;
        var pairView = twgl.m4.inverse(drawingState.view);
        twgl.m4.multiply(pairView, this.toPair, pairView);
        twgl.m4.inverse(pairView, pairView);
        drawingState.view = pairView;
        drawingState.toFramebuffer = true;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.framebuffer);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        grobjects.forEach(function (obj) {
            if (!obj.doubleRender) {
                obj.draw(drawingState);
            }
        });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        drawingState.view = storeView;
        drawingState.toFramebuffer = false;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,
            {
                model: this.trans,
                view: drawingState.view,
                proj: drawingState.proj,
                uTexture: frameBuffer.attachments[0]
            });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };

    mirror.prototype.center = function (drawingState) {
        return this.position;
    };

})();
grobjects.push(new mirror([4, 2, -2], [0, 0, 1], [1, 0, 0]));
grobjects.push(new mirror([-4, 2, -2], [0, 0, 1], [1, 0, 0]));