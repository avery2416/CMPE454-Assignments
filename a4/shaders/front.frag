// front.frag

#version 300 es

#define SURFACE 0		// renderType
#define DRR     1
#define MIP     2

#define BASE         0  // demoMode
#define CUBE         1
#define FRONT_COORDS 2
#define FBO_COORDS   3
#define BACK_COORDS  4
#define DISTANCE     5
#define LIGHT_DIR    6
#define ONE_ITER     7
#define ALL_ITER     8
#define SOLUTION     9

precision highp float;

uniform sampler2D texture_fbo;
uniform sampler3D texture_volume;
uniform sampler3D texture_gradient;

uniform float fbWidth;
uniform float fbHeight;
uniform float slice_spacing;
uniform float densityFactor;
uniform float shininess;

uniform int   renderType;
uniform int   invert;
uniform int   useSpecular;
uniform int   demoMode;

uniform vec3 light_direction;
uniform vec3 lightColour;
uniform vec3 volumeScale;

uniform mat4 MVinverse;

in vec3 texCoords;		// texCoords on front face of volume
in vec3 fragPosition;		// fragment position in VCS

out vec4 fragColour;



void main()

{
  // Get cube's front texCoords 

  vec3 frontCoords = vec3(0,1,0);  // [YOUR CODE HERE]

#if 1 // testing
  fragColour = vec4( frontCoords, 1 );
  return;
#endif

  // Compute texture coordinate of this fragment in the 2D FBO.  These
  // texture coordinates are in [0,1]x[0,1].
  //
  // Use the implicitly-defined 'gl_FragCoord', which is the PIXEL
  // POSITION of the fragment in the framebuffer in the range
  //
  //    [0,width-1] x [0,height-1]
  //
  // where 'width' and 'height' are the dimensions of the framebuffer.

  vec2 fboCoords = vec2( 0, 0 ); // [YOUR CODE HERE]

#if 1 // testing.  zoom in to make the bounding volume fill the whole screen.
  fragColour  = vec4( fboCoords.x, fboCoords.y, 0, 1 );
  return;
#endif

  // Get cube's back texCoords
  //
  // These are stored in the FBO texture.

  vec3 backCoords = vec3(0,0,1); // [YOUR CODE HERE]

#if 1 // testing
  fragColour = vec4( backCoords, 1 );
  return;
#endif

  // determine front-to-back distance in WORLD COORDINATES.  You'll
  // have to scale the [0,1]x[0,1]x[0,1] texture coordinates by
  // 'volumeScale' to get the world coordinates, and then compute the
  // distance.

  float dist = 0.5;  // [YOUR CODE HERE]

#if 1 // testing.  You should see different distances in the bounding volume.
  fragColour = vec4( dist, dist, dist, 1 );
  return;
#endif

  // Determine the NORMALIZED viewing direction along this ray back
  // toward the eye.  Then move this into the OCS, since the gradients
  // (i.e. surface normals) are in the OCS and all lighting
  // calculations should take place in the OCS.

  vec3 viewDir = vec3(1,0,0);

#if 1 // testing
  fragColour = vec4( 0.5 * (viewDir + vec3(1,1,1)), 1 );
  return;
#endif

  // Step front-to-back, accumulating colour
  //
  // Use the correct spacing in texture coordinates.
  //
  // See the lecture notes for details here.
  //
  // When computing alpha at a position inside the volume, MULTIPLY IT
  // BY THE UNIFORM 'densityFactor', which the user controls by
  // pressing '+' or '-' to make things appear more or less dense.

  vec3 Iout = vec3( 0.7, 0.3, 0.4 );
  float trans = 1.0;

#if 0
  for ( ... ) {

    // Gather tau, alpha, and the gradient

    // [YOUR CODE HERE]



    // Compute C based on the current 'renderType', which is one of
    // MIP, DRR, or SURFACE.
    //
    // Initially, do this only for the DRR, which is the simplest
    // computation.  (See the lecture notes on this.)

    vec3 C;

    // [YOUR CODE HERE]


    // Add this position's C to the accumulated colour, including the
    // appropriate alpha.
    //
    // How you do this will depend on the 'renderType'.

  }
#endif

  // Output

  if (invert == 1)
     Iout = vec3(1,1,1) - Iout;

  fragColour = vec4( Iout, 1 );
}
