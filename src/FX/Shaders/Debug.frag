precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 dimensions;
uniform vec4 inputPixel;
uniform float progress;

void main()
{
    vec2 coord = vTextureCoord;
    vec4 color = texture2D(uSampler, coord);

    color = color + vec4(1.0, 0.0, 1.0, 0.3) * 0.5;
    gl_FragColor = color;
}
