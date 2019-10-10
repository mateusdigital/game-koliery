//----------------------------------------------------------------------------//
// TextGradientEffect                                                         //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class TextGradientEffect
    extends PIXI.Filter
{
    //--------------------------------------------------------------------------
    constructor(textRef, color)
    {
        super(
            null,
            PIXI_LOADER_RES["src/FX/Shaders/TextGradient.frag"].data
        );

        //
        // iVars
        // Refs.
        this.textRef = textRef;
        // Properties.
        this.color = [];
        // Uniforms.
        this.uniforms.dimensions  = [0, 0];
        this.uniforms.targetColor = [0, 0, 0, 0];

        //
        // Initialize.
        this.SetColor(color);
    } // ctor

    //--------------------------------------------------------------------------
    SetColor(color)
    {
        const gl = color.gl();
        this.color = [gl[0], gl[1], gl[2], 1.0];
    } // SetColor

    //--------------------------------------------------------------------------
    apply(filterManager, input, output, clear)
    {
        this.uniforms.dimensions[0] = this.textRef.width;
        this.uniforms.dimensions[1] = this.textRef.height;
        this.uniforms.targetColor   = this.color;

        filterManager.applyFilter(this, input, output, clear);
    } // apply
} // class TextGradientEffect
