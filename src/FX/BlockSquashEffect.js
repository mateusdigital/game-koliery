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
        const frag_src = PIXI_LOADER_RES["src/FX/Shaders/BlockSquash.frag"].data;

        super(null, frag_src);

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
