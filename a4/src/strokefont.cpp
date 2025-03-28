// strokefont.h
//
// Draw characters using FreeGlut's stroke characters
//
// The code from freeglut has be extracted and modified here so
// there's no dependence on freeglut.
//
// Draw 'string' at position (x,y) in viewing coordinates
// [-1,1]x[-1,1].  Scale the string to have height 'height'.
//
// We need 'transformLocation' to be the location at which to store
// the transformation matrix for the GPU shader.  This is found by the
// calling program using glGetUniformLocation().


#include "strokefont.h"
#include "fg_stroke.h" 
#include "gpuProgram.h" 


// Shaders for font rendering


GPUProgram *fontGPUProg;


char *fontVertexShader =

  R"XX(

  #version 300 es

  layout (location = 0) in vec4 position;
  uniform mediump mat4 MVP;

  void main()

  {
     gl_Position = MVP * position;
  }

)XX";



char *fontFragmentShader =

  R"XX(

  #version 300 es

  uniform mediump vec3 colour;
  out mediump vec4 fragColour;

  void main()

  {
    fragColour = vec4( colour, 1 );
  }

)XX";



void setupStrokeStrings()

{
  fontGPUProg = new GPUProgram();
  fontGPUProg->init( fontVertexShader, fontFragmentShader, "strokefont" );
}



void drawStrokeString( string str, float x, float y, float height, float theta, vec3 colour )

{
  fontGPUProg->setVec3( "colour", colour );
  float s = height / (float) fgStrokeMonoRoman.Height; // scale of letters
  float xInc = 0;

  //float initX = x;

  // Draw each letter

  for (unsigned int k=0; k<str.size(); k++) 

    if (str[k] == '\n') {	// handle newline

      xInc = 0;
      y -= height * 1.2;

    } else {

      mat4 transform
	= translate( x, y, 0 )
	* rotate( theta, vec3(0,0,1) )
	* translate( xInc, 0, 0 )
	* scale( s, s, 1 );

      fontGPUProg->setMat4( "MVP", transform );

      // glutStrokeCharacter( font, str[k] );
      //
      // The following is extracted from FreeGlut source.

      SFG_StrokeFont        *font  = &fgStrokeMonoRoman;
      const SFG_StrokeChar  *schar = font->Characters[ (unsigned char) str[k] ];
      const SFG_StrokeStrip *strip = schar->Strips;

      for (int i=0; i<schar->Number; i++, strip++) {

	// Create a VAO for this stroke

	GLuint VAO;
	glGenVertexArrays( 1, &VAO );
	glBindVertexArray( VAO );

	// Fill a buffer with the stroke's vertices

	float *verts = new float[strip->Number*2];

	for (int j=0; j<strip->Number; j++) {
	  verts[j*2+0] = strip->Vertices[ j ].X;
	  verts[j*2+1] = strip->Vertices[ j ].Y;
	}

	// Fill a VBO with the stroke's vertices

	GLuint VBO;
	glGenBuffers( 1, &VBO );
	glBindBuffer( GL_ARRAY_BUFFER, VBO );
	glBufferData( GL_ARRAY_BUFFER, strip->Number*2*sizeof(float), verts, GL_STATIC_DRAW );

	delete[] verts;

	// Draw the stroke

	glEnableVertexAttribArray( 0 );
	glVertexAttribPointer( 0, 2, GL_FLOAT, GL_FALSE, 0, 0 );

	glDrawArrays( GL_LINE_STRIP, 0, strip->Number );

	// Free everything

	glDisableVertexAttribArray( 0 );
	glDeleteBuffers( 1, &VBO );
	glDeleteVertexArrays( 1, &VAO );
      }

      // Move to next position

      xInc += s * schar->Right;
    }
}
