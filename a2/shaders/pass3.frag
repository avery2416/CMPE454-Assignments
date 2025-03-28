// Pass 3 fragment shader
//
// Output fragment colour based using
//    (a) Cel shaded diffuse surface
//    (b) wide silhouette in black

#version 300 es

uniform mediump vec3 lightDir;     // direction toward the light in the VCS
uniform mediump vec2 texCoordInc;  // texture coord difference between adjacent texels

in mediump vec2 texCoords;              // texture coordinates at this fragment

// The following four textures are now available and can be sampled
// using 'texCoords'

uniform sampler2D colourSampler;
uniform sampler2D normalSampler;
uniform sampler2D depthSampler;
uniform sampler2D laplacianSampler;

out mediump vec4 outputColour;          // the output fragment colour as RGBA with A=1


void main()

{
  mediump vec2 dummy = texCoords;  // REMOVE THIS ... It's just here because MacOS complains otherwise

  // [0 marks] Look up values for the depth and Laplacian.  Use only
  // the R component of the texture as texture2D( ... ).r

  // YOUR CODE HERE
  // texture2D has been depricated so will be using texture( ... ).r instead
  mediump float depth = texture(depthSampler, texCoords).r;
  mediump float laplacian = texture(laplacianSampler, texCoords).r;

  // [1 mark] Discard the fragment if it is a background pixel not
  // near the silhouette of the object.

  // YOUR CODE HERE
  // Discard fragment if background pixel
  if (depth >= 1.0 && abs(laplacian) < 0.1)
    discard;

  // [0 marks] Look up value for the colour and normal.  Use the RGB
  // components of the texture as texture2D( ... ).rgb or texture2D( ... ).xyz.

  // YOUR CODE HERE
  mediump vec3 colour = texture(colourSampler, texCoords).rgb;
  mediump vec3 normal = texture(normalSampler, texCoords).xyz;  


  // [2 marks] Compute Cel shading, in which the diffusely shaded
  // colour is quantized into four possible values.  Do not allow the
  // diffuse component, N dot L, to be below 0.2.  That will provide
  // some ambient shading.  Your code should use the 'numQuata' below
  // to have that many divisions of quanta of colour.  Your code
  // should be very efficient.

  const mediump float numQuanta = 3.0;

  // YOUR CODE HERE
  mediump float NdotL = max(0.2, dot(normal, lightDir));
  mediump float quantizedNdotL = floor(NdotL * numQuanta) / numQuanta;
  mediump vec3 celColor = colour * quantizedNdotL;

  // [2 marks] Look at the fragments in the neighbourhood of
  // this fragment.  Your code should use the 'kernelRadius'
  // below and check all fragments in the range
  //
  //    [-kernelRadius,+kernelRadius] x [-kernelRadius,+kernelRadius]
  //
  // around this fragment.
  //
  // Find the neighbouring fragments with a Laplacian beyond the
  // threshold.  Of those fragments, find the distance to the closest
  // one.  That distance, divided by the maximum possible distance
  // inside the kernel, is the blending factor.
  //
  // You can use a large kernelRadius here (e.g. 10) to see that
  // blending is being done correctly.  Do not use '3.0' or '-0.1' in
  // your code; use 'kernelRadius' and 'threshold'.

  const mediump float kernelRadius = 3.0;
  const mediump float threshold = 0.1;

  // YOUR CODE HERE
  mediump float minDist = kernelRadius;
  mediump float maxDist = minDist;
    
  for (float i = -kernelRadius; i <= kernelRadius; i++) {
    for (float j = -kernelRadius; j <= kernelRadius; j++) {
      if (i == 0.0 && j == 0.0) 
        continue;
            
      mediump vec2 offset = vec2(i, j) * texCoordInc;
      mediump float neighborLaplacian = texture(laplacianSampler, texCoords + offset).r;
            
      if (abs(neighborLaplacian) > threshold) {
        mediump float dist = length(vec2(i, j));
        minDist = min(minDist, dist);
      }
    }
  }

  mediump float blendFactor = minDist / maxDist;


  // [1 mark] Output the fragment colour.  If there is an edge
  // fragment in the 3x3 neighbourhood of this fragment, output a grey
  // colour based on the blending factor.  The grey should be
  // completely black for an edge fragment, and should blend to the
  // Phong colour as distance from the edge increases.  If these is no
  // edge in the neighbourhood, output the cel-shaded colour.
  
  // YOUR CODE HERE
  if (minDist < maxDist)
      outputColour = vec4(mix(vec3(0.0), celColor, blendFactor), 1.0);
  else
    outputColour = vec4(celColor, 1.0);
}
