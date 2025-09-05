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
    if(c0.w== 0.0) {
        gl_FragColor = c0;
        return;
    }

    float alpha      = 0.0;
    float gray       = 0.9;
    vec4  gray_color = vec4(gray, gray, gray, 1.0);


    float y = uv.y;
    if(uv.y < 0.5) {
        y = uv.y * 2.0;
    } else {
        y = 1.0 - (2.0 * uv.y - 1.0);
    }
    float m = steep_step(y, 5.0);

    vec4 temp = mix(targetColor, gray_color, m);
    vec4 final = mix(targetColor, temp, m);

    vec4 grad_color =
    gl_FragColor    = final;
}
