class TextUncoverEffect
    extends PIXI.Filter
{
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
    }

    apply(filterManager, input, output, clear)
    {
        this.uniforms.progress      = this.tweenRef.getValue().t;
        this.uniforms.dimensions[0] = this.textRef.width;
        this.uniforms.dimensions[1] = this.textRef.height;
        filterManager.applyFilter(this, input, output, clear);
    }
}
