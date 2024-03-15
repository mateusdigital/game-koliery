//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Utils.js                                                      //
//  Project   : pw_js_core                                                    //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
function
pw_Utils_AddRuntimeProperty(obj, propName, value)
{
    const full_prop_name = pw_String_Cat("rtvar_", propName);
    obj[full_prop_name] = value;
}


//------------------------------------------------------------------------------
function
pw_Utils_UniqueId()
{
    if(this.s_unique_id == undefined) {
        this.s_unique_id = 0;
    }
    return this.s_unique_id++;
}

//------------------------------------------------------------------------------
function
pw_Utils_IsNullOrUndefined(v)
{
    return v == null || v == undefined;
}



//----------------------------------------------------------------------------//
// Query String                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Utils_GetQueryString()
{
    const params = new URLSearchParams(location.search);
    return params;
}

// @XXX
const dlog = console.log

//----------------------------------------------------------------------------//
// Coords Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Coords_GetSurrounding(v)
{
    let coords = [];
    for(let i = -1; i <= +1; ++i) {
        let yy = v.y + i;
        for(let j = -1; j <= +1; ++j) {
            let xx = v.x + j;

            if(yy == v.y && xx == v.x) { // Don't want the same coord.
                continue;
            }

            coords.push(pw_Vector_Create(xx, yy));
        }
    }

    return coords;
}

//------------------------------------------------------------------------------
function
pw_Coords_GetAdjacent(v)
{
    let coords = [];
    coords.push(pw_Vector_Create(v.x +0, v.y +1)); // Bottom
    coords.push(pw_Vector_Create(v.x +1, v.y +0)); // Right
    coords.push(pw_Vector_Create(v.x -1, v.y +0)); // Top
    coords.push(pw_Vector_Create(v.x +0, v.y -1)); // Left
    return coords;
}
