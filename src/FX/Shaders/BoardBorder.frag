precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 dimensions;
uniform vec4 inputPixel;
uniform float progress;


float steep_step(float y, float steps)
{
    float _stepAmount = 1.0 / steps;
    float _steps      = steps + 1.0;

    if(y == 1.0) {
        // y = 0.99;
    }
    float m = float(int(_steps * y)) * _stepAmount;
    return m;
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec2 uv    = vTextureCoord * inputPixel.xy / dimensions.xy;

    float t = progress;
    float m = steep_step(t, 42.0);
    float y = uv.y;

    if(y > m) {
        color = vec4(1.0, 0.0, 1.0, 1.0) * 0.0;
    }
    // float range_min = dimensions.y * (0.5 - t);
    // float range_max = dimensions.y * (0.5 + t);
    // if(coord.y > range_min && coord.y < range_max) {

    // } else {
    //     color = vec4(1.0, 1.0, 0.0, 0.0) * 0.0;
    // }

    gl_FragColor = color;
}
