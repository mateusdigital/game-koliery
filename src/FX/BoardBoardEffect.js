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
        this.uniforms.progress      = this.tweenRef.getValue().t;
        this.uniforms.dimensions[0] = this.boardBorderRef.width;
        this.uniforms.dimensions[1] = this.boardBorderRef.height;
        filterManager.applyFilter(this, input, output, clear);
    } // apply

} // class BoardBorderEffect
