// cube.cpp


#include "headers.h"

#include "cube.h"
#include "main.h"
#include "linalg.h"


void renderCubeOutline()

{
  static GLuint VAO;
  static bool firstTime = true;

  if (firstTime) {

    firstTime = false;

    // VAO

    glGenVertexArrays( 1, &VAO );
    glBindVertexArray( VAO );

    // positions & colours

    vec3 colour(1,1,1);

    vec3 verts[] = {
      vec3(0,0,0), colour,
      vec3(0,0,1), colour,
      vec3(0,1,0), colour,
      vec3(0,1,1), colour,
      vec3(1,0,0), colour,
      vec3(1,0,1), colour,
      vec3(1,1,0), colour,
      vec3(1,1,1), colour,
      vec3(0,0,0), colour,
      vec3(1,0,0), colour,
      vec3(0,0,1), colour,
      vec3(1,0,1), colour,
      vec3(0,1,0), colour,
      vec3(1,1,0), colour,
      vec3(0,1,1), colour,
      vec3(1,1,1), colour,
      vec3(0,0,0), colour,
      vec3(0,1,0), colour,
      vec3(0,0,1), colour,
      vec3(0,1,1), colour,
      vec3(1,0,0), colour,
      vec3(1,1,0), colour,
      vec3(1,0,1), colour,
      vec3(1,1,1), colour
    };

    // VBO

    GLuint vertexbuffer;
    glGenBuffers(1, &vertexbuffer);
    glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(verts), (GLfloat*) &verts[0], GL_STATIC_DRAW);

    // Position (attribute 0)

    glEnableVertexAttribArray( 0 );
    glVertexAttribPointer( 0, 3, GL_FLOAT, GL_FALSE, 2 * sizeof(vec3), 0 );

    // Colour (attribute 1)

    glEnableVertexAttribArray( 1 );
    glVertexAttribPointer( 1, 3, GL_FLOAT, GL_FALSE, 2 * sizeof(vec3), (GLvoid*) sizeof(vec3) );
  }

  glBindVertexArray( VAO );
  glDrawArrays( GL_LINES, 0, 24 );
}


void renderCubeWithRGBCoords()

{
  if (demoMode == BASE) {
    renderCubeOutline();
    return;
  }

#if 1
  renderCubeOutline();  // This is just a placeholder until you get your cube working
#else

  // [YOUR CODE HERE]
  
#endif
}
