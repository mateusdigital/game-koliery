precision mediump float;

varying vec2      vTextureCoord;
uniform sampler2D uSampler;
uniform vec4      inputPixel;
uniform vec2      dimensions;
uniform vec4      tintColor;
uniform vec4      specularColor;
uniform vec4      shadowColor;


void main()
{
    vec2 coord = (vTextureCoord * inputPixel.xy);

    float os1 = 2.0;

    float bs1 = 3.0 * 1.0;
    float bs2 = 3.0 * 2.0;
    float bs3 = 3.0 * 3.0;

    if(
        (
            coord.x >= bs1 && coord.x <= bs2 &&
            coord.y >= bs1 && coord.y <= bs2
        )
            ||
        (
            coord.x >= bs2 && coord.x <= bs3 &&
            coord.y >= bs1 && coord.y <= bs2
        )
            ||
        (
             coord.x >= bs1 && coord.x <= bs2 &&
             coord.y >= bs2 && coord.y <= bs3
        )
    )
    {
        gl_FragColor = specularColor;
    }

    else if(

        coord.x >= 0.0 && coord.x <= os1 ||
        coord.x >= dimensions.x -   os1 ||
        coord.y >= 0.0 && coord.y <= os1 ||
        coord.y > dimensions.y - os1  + 1.0
    )
    {
        gl_FragColor = shadowColor;
    }
    else {
        gl_FragColor = tintColor;
    }
}
