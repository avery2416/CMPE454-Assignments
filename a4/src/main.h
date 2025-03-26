// main.h


#ifndef MAIN_H
#define MAIN_H

void glErrorReport( char *where );

#define VOLUME_TEXTURE_UNIT   0
#define GRADIENT_TEXTURE_UNIT 1
#define FIRST_GBUFFER_TEXTURE_UNIT 2

#define SHADER_DIR "../shaders"

typedef enum { BASE, CUBE, FRONT_COORDS, FBO_COORDS, BACK_COORDS, DISTANCE, LIGHT_DIR, ONE_ITER, ALL_ITER, SOLUTION, NUM_DEMO_MODES } DemoModeType;
extern DemoModeType demoMode;
extern char *demoModeNames[NUM_DEMO_MODES];
#endif
