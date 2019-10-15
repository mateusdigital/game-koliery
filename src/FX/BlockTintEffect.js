//----------------------------------------------------------------------------//
// BlockTintEffect                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Apply_BlockTintEffect(blockRef, color)
{
    if(!blockRef.filters) {
        blockRef.filters = [];
    }

    blockRef.blockTintEffect = new BlockTintEffect(blockRef, color)
    blockRef.filters.push(blockRef.blockTintEffect);
}

//------------------------------------------------------------------------------
class BlockTintEffect
    extends PIXI.Filter
{
    //--------------------------------------------------------------------------
    constructor(blockRef, color)
    {
        super(
            null,
            PIXI_LOADER_RES["src/FX/Shaders/BlockTint.frag"].data
        );

        //
        // iVars
        // Refs.
        this.blockRef = blockRef;
        this.tintColor     = null;
        this.specularColor = null;
        this.shadowColor   = null;

        // Uniforms
        this.uniforms.dimensions    = [0, 0];
        this.uniforms.tintColor     = [0, 0, 0, 0];
        this.uniforms.specularColor = [0, 0, 0, 0];
        this.uniforms.shadowColor   = [0, 0, 0, 0];

        // Initialize
        this.SetColor(color);
    } // ctor

    //--------------------------------------------------------------------------
    SetColor(color)
    {
        this.tintColor     = color            .gl();
        this.specularColor = color.brighten(1).gl();
        this.shadowColor   = color.darken  (1).gl();
    }

    //--------------------------------------------------------------------------
    apply(filterManager, input, output, clear)
    {
        this.uniforms.dimensions[0] = this.blockRef.width;
        this.uniforms.dimensions[1] = this.blockRef.height;

        this.uniforms.tintColor     = this.tintColor;
        this.uniforms.specularColor = this.specularColor;
        this.uniforms.shadowColor   = this.shadowColor;

        filterManager.applyFilter(this, input, output, clear);
    } // apply

} // class BlockTintEffect
