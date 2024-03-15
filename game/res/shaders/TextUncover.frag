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

    coord = coord.xy * inputPixel.xy;

    float t = progress * 0.5;

    float range_min = dimensions.y * (0.5 - t);
    float range_max = dimensions.y * (0.5 + t);
    if(coord.y > range_min && coord.y < range_max) {

    } else {
        color = vec4(1.0, 1.0, 0.0, 0.0) * 0.0;
    }

    gl_FragColor = color;
}
