function Apply_Debug_Filter(obj)
{
    const filter = new DebugFilter(obj);
    if(!obj.filters) {
        obj.filters = [];
    }
    obj.filters.push(filter);
}

class DebugFilter
    extends PIXI.Filter
{
    constructor(obj)
    {
        super(
            null,
            PIXI_LOADER_RES["src/FX/Shaders/Debug.frag"].data
        );

        this.objRef = obj;
        this.uniforms.dimensions = [0, 0];
    }

    apply(filterManager, input, output, clear)
    {
        filterManager.applyFilter(this, input, output, clear);

        this.uniforms.dimensions[0] = this.objRef.width;
        this.uniforms.dimensions[1] = this.objRef.height;
    }
}
