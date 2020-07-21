//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : BoardBoardEffect.js                                           //
//  Project   : columns                                                       //
//  Date      : Oct 10, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// BoardBorderEffect                                                          //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Apply_BoardBorderEffect(boardBorderRef, tweenRef)
{
    if(!boardBorderRef.filters) {
        boardBorderRef.filters = [];
    }
    boardBorderRef.filters.push(new BoardBorderEffect(boardBorderRef, tweenRef));
}

//------------------------------------------------------------------------------
class BoardBorderEffect
    extends PIXI.Filter
{
    //--------------------------------------------------------------------------
    constructor(boardBorderRef, tweenRef)
    {
        super(
            null,
            PIXI_LOADER_RES["src/FX/Shaders/BoardBorder.frag"].data
        );

        //
        // iVars
        // Refs.
        this.boardBorderRef  = boardBorderRef;
        this.tweenRef        = tweenRef;
        // Uniforms
        this.uniforms.progress   = 0;
        this.uniforms.dimensions = [0, 0];
    } // ctor

    //--------------------------------------------------------------------------
    apply(filterManager, input, output, clear)
    {
        this.uniforms.progress      = this.tweenRef.getValue().value;
        this.uniforms.dimensions[0] = this.boardBorderRef.width;
        this.uniforms.dimensions[1] = this.boardBorderRef.height;
        filterManager.applyFilter(this, input, output, clear);
    } // apply

} // class BoardBorderEffect
