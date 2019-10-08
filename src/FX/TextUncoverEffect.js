class TextUncoverEffect
{
    //--------------------------------------------------------------------------
    constructor(textRef)
    {
        //
        // iVars
        // Refs.
        this.textRef = textRef;
        // Properties
        this.uniforms = this._CreateUniforms();
        this.filter   = this._CreateFilter  ();
        this.progress = 0;

        //
        // Initialize.
        this.textRef.filters = [this.filter];
    } // ctor


    //--------------------------------------------------------------------------
    _CreateUniforms()
    {
        const width  = this.textRef.width;
        const height = this.textRef.height;

        const uniform = {
            dimensions : { type: 'v2',    value: [width, height] },
            progress   : { type: "float", value: 0 }
        };

        return uniform;
    } // _CreateUniforms

    //--------------------------------------------------------------------------
    _CreateFilter()
    {
        const width       = this.textRef.width;
        const height      = this.textRef.height;
        const frag_source = PIXI_LOADER_RES["src/FX/Shaders/TextUncover.frag"].data;

        const filter = new PIXI.Filter(null, frag_source, this.uniforms);
        filter.apply = (filterManager, input, output) => {
            this.uniforms.progress      = this.progress;
            this.uniforms.dimensions[0] = width;
            this.uniforms.dimensions[1] = height;

            filterManager.applyFilter(filter, input, output);
        }

        return filter;
    } // _CreateFilter
}; // class TextUncoverEffect
