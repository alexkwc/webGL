var canvas;
var gl;
var program;
var cube;
var sceneViewMatrix;
var theta = 0;
var lightPosition;
var shadowMapViewMatrix;
var framebuffer;
var mouseBottonDown = false;
var glassTranslation = vec3(-0.5, 0, 0);
var glassTranslationMovementScale = 0.0035;


class FramebufferObject {
    constructor() {
        this.framebufferObject = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferObject);

        this.texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            canvas.width,
            canvas.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            this.texture,
            0
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}


class Glass {
    constructor() {
        var vertices = [
            vec3(-0.25, 1, 0),
            vec3(-0.25, -1, 0),
            vec3(0.25, -1, 0),
            vec3(0.25, 1, 0),
        ]
        var indicies = new Uint16Array(
            [
                0, 1, 2, 0, 2, 3,
            ]
        )

        this.vertexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indiciesLength = indicies.length

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    }
}


class Plane {
    constructor() {
        var vertices = [
            vec3(50, -1, -50),
            vec3(50, -1, 50),
            vec3(-50, -1, 50),
            vec3(-50, -1, -50),
        ]
        var normals = [
            vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0),
        ]

        var indicies = new Uint16Array(
            [
                0, 1, 2, 0, 2, 3
            ]
        )

        this.vertexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indiciesLength = indicies.length

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
}


class Cube {
    constructor() {
        var vertices = [
            vec3(1, 1, 1), vec3(-1, 1, 1), vec3(-1, -1, 1), vec3(1, -1, 1),
            vec3(1, 1, -1), vec3(1, 1, 1), vec3(1, -1, 1), vec3(1, -1, -1),
            vec3(1, 1, -1), vec3(1, -1, -1), vec3(-1, -1, -1), vec3(-1, 1, -1),
            vec3(-1, 1, -1), vec3(-1, -1, -1), vec3(-1, -1, 1), vec3(-1, 1, 1),
            vec3(1, 1, 1), vec3(1, 1, -1), vec3(-1, 1, -1), vec3(-1, 1, 1),
            vec3(-1, -1, 1), vec3(-1, -1, -1), vec3(1, -1, -1), vec3(1, -1, 1),
        ]
        var normals = [
            vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0),
            vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1),
            vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0),
            vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0),
            vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0),
        ]
        var indicies = new Uint16Array(
            [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23,
            ]
        )

        this.vertexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indiciesLength = indicies.length

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
}


function renderPlane(framebufferObject) {
    gl.bindTexture(gl.TEXTURE_2D, framebufferObject.texture);
    gl.useProgram(planeProgram);

    var vertexPositionLoc = gl.getAttribLocation(planeProgram, "a_position");
    var vertexNormalLoc = gl.getAttribLocation(planeProgram, "a_normal");
    var modelMatrixLoc = gl.getUniformLocation(planeProgram, "u_modelMatrix");
    var viewMatrixLoc = gl.getUniformLocation(planeProgram, "u_viewMatrix");
    var normalMVMatrixLoc = gl.getUniformLocation(
        planeProgram,
        "u_normalMVMatrix"
    );
    var objectColorLoc = gl.getUniformLocation(planeProgram, "u_objectColor");
    var shadowViewMatrixLoc = gl.getUniformLocation(
        planeProgram,
        "u_shadowViewMatrix"
    );


    gl.uniform4fv(objectColorLoc, vec4(1.0, 1.0, 1.0, 1.0));
    gl.uniformMatrix4fv(
        shadowViewMatrixLoc,
        false,
        flatten(shadowMapViewMatrix)
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexBuffer);
    gl.vertexAttribPointer(vertexPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, plane.normalBuffer);
    gl.vertexAttribPointer(vertexNormalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormalLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.indexBuffer);

    setMVMatrix(
        modelMatrixLoc,
        viewMatrixLoc,
        normalMVMatrixLoc,
        sceneViewMatrix,
        mat4()
    );

    gl.drawElements(gl.TRIANGLES, plane.indiciesLength, gl.UNSIGNED_SHORT, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return 0;
}


function renderSceneWithColorGlass() {
    gl.useProgram(colorGlassProgram);

    var vertexPositionLoc = gl.getAttribLocation(
        colorGlassProgram,
        "a_position"
    );
    var colorLoc = gl.getUniformLocation(colorGlassProgram, "u_color");
    var matrixLoc = gl.getUniformLocation(colorGlassProgram, "u_matrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, glass.vertexBuffer);
    gl.vertexAttribPointer(vertexPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionLoc);

    gl.uniform4fv(colorLoc, vec4(0.5, 0.5, 0.0, 0.5));
    gl.uniformMatrix4fv(
        matrixLoc,
        false,
        flatten(translate(...glassTranslation))
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glass.indexBuffer);

    gl.drawElements(gl.TRIANGLES, glass.indiciesLength, gl.UNSIGNED_SHORT, 0);

    return 0;
}


function renderScene(framebufferObject) {
    sceneViewMatrix = mult(
        perspective(60, canvas.width / canvas.height, 0.1, 100),
        lookAt(vec3(5, 5, -7), vec3(0, 0, 0), vec3(0, 1, 0))
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    renderPlane(framebufferObject);
    gl.useProgram(program);
    var vertexPositionLoc = gl.getAttribLocation(program, "a_position");
    var vertexNormalLoc = gl.getAttribLocation(program, "a_normal");
    var modelMatrixLoc = gl.getUniformLocation(program, "u_modelMatrix");
    var viewMatrixLoc = gl.getUniformLocation(program, "u_viewMatrix");
    var normalMVMatrixLoc = gl.getUniformLocation(program, "u_normalMVMatrix");
    var lightPositionLoc = gl.getUniformLocation(program, "u_lightPosition");
    var objectColorLoc = gl.getUniformLocation(program, "u_objectColor");


    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
    gl.vertexAttribPointer(vertexPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.normalBuffer);
    gl.vertexAttribPointer(vertexNormalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormalLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
    gl.uniform4fv(lightPositionLoc, vec4(lightPosition, 1.0));
    gl.uniform4fv(objectColorLoc, vec4(1.0, 0.0, 0.0, 1.0));

    setMVMatrix(
        modelMatrixLoc,
        viewMatrixLoc,
        normalMVMatrixLoc,
        sceneViewMatrix,
        cubeModelMatrix
    );

    gl.drawElements(gl.TRIANGLES, cube.indiciesLength, gl.UNSIGNED_SHORT, 0);

    return 0;
}


function generateShadowMap(framebuffer) {
    gl.useProgram(shadowMapProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebufferObject);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    var vertexPositionLoc = gl.getAttribLocation(
        shadowMapProgram,
        "a_position"
    );
    var modelMatrixLoc = gl.getUniformLocation(
        shadowMapProgram,
        "u_modelMatrix"
    );
    var viewMatrixLoc = gl.getUniformLocation(shadowMapProgram, "u_viewMatrix");
    var nearLoc = gl.getUniformLocation(shadowMapProgram, "near");
    var farLoc = gl.getUniformLocation(shadowMapProgram, "far");

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
    gl.vertexAttribPointer(vertexPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);

    setMVMatrix(
        modelMatrixLoc,
        viewMatrixLoc,
        null,
        shadowMapViewMatrix,
        cubeModelMatrix
    );

    gl.uniform1f(nearLoc, 0.1)
    gl.uniform1f(farLoc, 100)
    gl.drawElements(gl.TRIANGLES, cube.indiciesLength, gl.UNSIGNED_SHORT, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return 0;
}


function render() {
    cubeModelMatrix = rotate(30, vec3(0, 1, 0));
    lightPosition = vec3(0, 4 + Math.cos(theta), -4);
    shadowMapViewMatrix = mult(
        perspective(50, canvas.width / canvas.height, 0.1, 100),
        lookAt(lightPosition, vec3(0, 0, 0), vec3(0, 1, 0))
    );
    generateShadowMap(framebuffer);
    renderScene(framebuffer);
    gl.depthMask(false);
    renderSceneWithColorGlass();
    gl.depthMask(true);

    theta += 0.01;
    window.requestAnimationFrame(render);

    return 0;
}


window.onload = function() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    document.addEventListener("mousedown", function(event) {
        if (event.button == 0) {
            mouseBottonDown = true;
        }
    }, true);
    document.addEventListener("mouseup", function(event) {
        if (event.button == 0) {
            mouseBottonDown = false;
        }
    }, true);
    document.addEventListener("mousemove", function(event) {
        if (mouseBottonDown) {
            var newXPosition = (
                event.movementX * glassTranslationMovementScale +
                glassTranslation[0]
            );
            if (newXPosition <= 0.8 && newXPosition >= -0.8) {
                glassTranslation = vec3(newXPosition, 0, 0)
            }
        }
    }, true);
    if (!gl) {
        alert("WebGL is not avaliable");
    }
    colorGlassProgram = initShaders(
        gl,
        "basic-vertex-shader",
        "color-glass-fragment-shader"
    );

    planeProgram = initShaders(gl, "vertex-shader", "plane-fragment-shader");
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    shadowMapProgram = initShaders(
        gl,
        "shadow-vertex-shader",
        "shadow-fragment-shader"
    );

    framebuffer = new FramebufferObject();
    cube = new Cube();
    plane = new Plane();
    glass = new Glass();
    render();

    return 0;
}


// helper function
function setMVMatrix(modelLoc, viewLoc, normalMVLoc, vMatrix, mMatrix) {
    var mvMatrix = mult(vMatrix, mMatrix)
    var normalMVMatrix = transpose(inverse(mvMatrix))
    gl.uniformMatrix4fv(modelLoc, false, flatten(mMatrix));
    gl.uniformMatrix4fv(viewLoc, false, flatten(vMatrix));
    if (normalMVLoc != null) {
        gl.uniformMatrix4fv(normalMVLoc, false, flatten(normalMVMatrix));
    }
}