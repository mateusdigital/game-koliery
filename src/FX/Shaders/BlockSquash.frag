precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 dimensions;
uniform vec4 inputPixel;
uniform float progress;

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec2 uv    = (vTextureCoord.xy * inputPixel.xy) / dimensions.xy;

    float t = (progress);
    if(uv.y < t || uv.y > (1.0 - t)) {
        color = vec4(1.0, 1.0, 0.0, 0.0) * 0.0;
    }

    gl_FragColor = color;
}
