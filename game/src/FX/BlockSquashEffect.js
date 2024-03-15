//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : BlockSquashEffect.js                                          //
//  Project   : columns                                                       //
//  Date      : Oct 15, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// BlockSquashEffect                                                          //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Apply_BlockSquashEffect(objRef, tweenRef)
{
    if(!objRef.filters) {
        objRef.filters = [];
    }
    objRef.filters.push(new BlockSquashEffect(objRef, tweenRef));
}

//------------------------------------------------------------------------------
class BlockSquashEffect
    extends PIXI.Filter
{
    //--------------------------------------------------------------------------
    constructor(objRef, tweenRef)
    {
        super(null, pw_Data_Get(RES_SHADERS_BLOCKSQUASH_FRAG));

        //
        // iVars
        // Refs.
        this.objRef   = objRef;
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
        this.uniforms.dimensions[0] = this.objRef.width;
        this.uniforms.dimensions[1] = this.objRef.height;

        filterManager.applyFilter(this, input, output, clear);
    } // apply
} // class BlockSquashEffect
