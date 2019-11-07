//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : TextGradientEffect.js                                         //
//  Project   : columns                                                       //
//  Date      : Oct 09, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// TextGradientEffect                                                         //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Apply_TextGradientEffect(textRef, color)
{
    if(!textRef.filters) {
        textRef.filters = [];
    }

    const effect = new TextGradientEffect(textRef, color)
    textRef.filters.push(effect);

    Utils_AddRuntimeProperty(textRef, "gradientEffect", effect);
}

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
