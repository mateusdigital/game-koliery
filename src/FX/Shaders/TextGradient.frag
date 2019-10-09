precision mediump float;

varying vec2      vTextureCoord;
uniform sampler2D uSampler;
uniform vec4      inputPixel;
uniform vec2      dimensions;
uniform vec4      targetColor;


float steep_step(float y, float steps)
{
    float _stepAmount = 1.0 / steps;
    float _steps      = steps + 1.0;

    if(y == 1.0) {
        y = 0.99;
    }
    float m = float(int(_steps * y)) * _stepAmount;
    return m;
}

void main()
{
    vec2 uv = vTextureCoord * inputPixel.xy / dimensions.xy;

    vec4 c0 = texture2D(uSampler, vTextureCoord);
    float a = 0.0;
    float c = 0.9;
    vec4 c1 = targetColor;
    vec4 c2 = vec4(c, c, c, 1.0);

    float y = uv.y;
    if(uv.y < 0.5) {
        y = uv.y * 2.0;
    } else {
        y = 1.0 - (2.0 * uv.y - 1.0);
    }
    float m = steep_step(y, 7.0);

    vec4 grad_color = mix(c1, c2, m);
    vec4 final_color = c0;

    if(final_color.a != 0.0) {
        final_color = mix(grad_color, final_color, 0.0);
    }

    gl_FragColor = final_color;
}
