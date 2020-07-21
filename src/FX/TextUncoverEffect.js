//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : TextUncoverEffect.js                                          //
//  Project   : columns                                                       //
//  Date      : Oct 08, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// TextUncoverEffect                                                          //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Apply_TextUncoverEffect(textRef, tweenRef)
{
    if(!textRef.filters) {
        textRef.filters = [];
    }
    textRef.filters.push(new TextUncoverEffect(textRef, tweenRef));
}

//------------------------------------------------------------------------------
class TextUncoverEffect
    extends PIXI.Filter
{
    //--------------------------------------------------------------------------
    constructor(textRef, tweenRef)
    {
        super(
            null,
            PIXI_LOADER_RES["src/FX/Shaders/TextUncover.frag"].data
        );

        //
        // iVars
        // Refs.
        this.textRef  = textRef;
        this.tweenRef = tweenRef;
        // Properties.
        this.progress = 0;
        // Uniforms
        this.uniforms.progress   = 0;
        this.uniforms.dimensions = [0, 0];
    } // ctor

    //--------------------------------------------------------------------------
    apply(filterManager, input, output, clear)
    {
        this.uniforms.progress      = this.tweenRef.getValue().value;
        this.uniforms.dimensions[0] = this.textRef.width;
        this.uniforms.dimensions[1] = this.textRef.height;
        filterManager.applyFilter(this, input, output, clear);
    } // apply

} // class TextUncoverEffect
