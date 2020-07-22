//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : DebugFilter.js                                                //
//  Project   : columns                                                       //
//  Date      : Oct 09, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

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
        super(null, pw_Data_Get(RES_SHADERS_DEBUG_FRAG));

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
