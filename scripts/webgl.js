var canvas;
var canvasRatio;
var gl;
var squareVerticesBuffer;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var perspectiveMatrix;

var polynomialUniform;
var derivativeUniform;

var menuCoordinates;

// On mouse move event

function onMouseMove(event)
{
    var clienWidth = document.documentElement.clientWidth;

    menuCoordinates[0] = math.complex(
        event.clientX *  2.0 / clienWidth - 1.0,
        event.clientY * -2.0 / clienWidth + 1.0);
}

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start()
{
  // Init menu coordinates

  menuCoordinates = [
      math.complex(Math.random() - 0.5, Math.random() - 0.5),
      math.complex(Math.random() - 0.5, Math.random() - 0.5),
      math.complex(Math.random() - 0.5, Math.random() - 0.5),
      math.complex(Math.random() - 0.5, Math.random() - 0.5)
  ]

  // Add mouse event listener

  document.getElementById("mainCanvas").onmousemove = onMouseMove;

  // Get the GL canvas element

  canvas = document.getElementById("glCanvas");
  canvasRatio = canvas.height / canvas.width;

  // Initialize the GL context

  initWebGL(canvas);

  // Only continue if WebGL is available and working

  if (gl)
  {
    gl.clearColor(1.0, 0.25, 0.75, 1.0); // Clear to pink for debugging, fully opaque
    gl.clearDepth(1.0);                  // Clear everything
    gl.enable(gl.DEPTH_TEST);            // Enable depth testing
    gl.depthFunc(gl.LEQUAL);             // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.

    initShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.

    initBuffers();

    // Set up to draw the scene periodically.

    setInterval(drawScene, 33);
  }
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL()
{
  gl = null;

  try
  {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {}

  // If we don't have a GL context, give up now

  if (!gl)
  {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// one object -- a simple two-dimensional square.
//
function initBuffers()
{
  // Create a buffer for the square's vertices.

  squareVerticesBuffer = gl.createBuffer();

  // Select the squareVerticesBuffer as the one to apply vertex
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

  // Now create an array of vertices for the square. Note that the Z
  // coordinate is always 0 here.

  var squareHeight = 1.0 - 2.0 * canvasRatio;

  var vertices = [
     1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
     1.0, squareHeight, 0.0,
    -1.0, squareHeight, 0.0
  ];

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

//
// drawScene
//
// Draw the scene.
//
function drawScene()
{
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 1.0, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  perspectiveMatrix = makePerspective(45, 1.0 / canvasRatio, 0.1, 100.0);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.

  loadIdentity();

  // Now move the drawing position a bit to where we want to start
  // drawing the square to fill the entire screen.

  // 1/tan(pi/8) = 1+sqrt(2) = 2.4142135624
  mvTranslate([0.0, canvasRatio - 1.0, canvasRatio * -2.4142135624]);

  // Draw the square by binding the array buffer to the square's vertices
  // array, setting attributes, and pushing it to GL.

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // Update the menu coordinates

  // menuCoordinates = [
  //     math.complex(-0.25,  0.2),
  //     math.complex(-0.25,  0.1),
  //     math.complex(-0.25, -0.0),
  //     math.complex(-0.25, -0.1)
  // ]

  // Get the menu polynomial and derivative

  var menuPolynomial = getPolynomial(menuCoordinates);
  var menuDerivative = getDerivative(menuPolynomial);

  // Set the shader uniforms

  gl.uniform2fv(polynomialUniform, complexToUniformArray(menuPolynomial));
  gl.uniform2fv(derivativeUniform, complexToUniformArray(menuDerivative));

  // Draw the square.

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders()
{
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  // Create the shader program

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  // Get the locations of the uniforms

  polynomialUniform = gl.getUniformLocation(shaderProgram, "uPolynomial");
  derivativeUniform = gl.getUniformLocation(shaderProgram, "uDerivative");
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id)
{
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

//
// Matrix utility functions
//

function loadIdentity()
{
  mvMatrix = Matrix.I(4);
}

function multMatrix(m)
{
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v)
{
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms()
{
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
