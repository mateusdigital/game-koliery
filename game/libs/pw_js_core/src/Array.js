//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Array.js                                                      //
//  Project   : pw_js_core                                                    //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Array_Create(size, defaultValue = null)
{
    let arr = new pw_Array_(size);
    arr.fill(defaultValue);
    return arr;
}

//------------------------------------------------------------------------------
function
pw_Array_Create2D(h, w, defaultValue = null)
{
    let arr = [];
    for(let i = 0; i < h; ++i) {
        arr.push([]);
        for(let j = 0; j < w; ++j) {
            arr[i].push(defaultValue);
        }
    }
    return arr;
}

//------------------------------------------------------------------------------
function
pw_Array_IsEmpty(arr)
{
    return arr.length == 0;
}

//------------------------------------------------------------------------------
function
pw_Array_IndexOf(arr, func)
{
    // @TODO(stdmatt): use js stuff...
    for(let i = 0; i < arr.length; ++i) {
        if(func(arr[i])) {
            return i;
        }
    }
    return -1;
}

//------------------------------------------------------------------------------
function
pw_Array_FindIf(arr, func)
{
    if(!arr) {
        return null;
    }

    let r = arr.find(func);
    return r;
}

//------------------------------------------------------------------------------
function
pw_Array_Contains(arr, func)
{
    if(!arr) {
        return false;
    }

    let r = arr.find(func);
    if(r == undefined) {
        return false;
    }
    return true;
}

//------------------------------------------------------------------------------
function
pw_Array_RemoveFront(arr)
{
    arr = arr.splice(0, 1);
}

//------------------------------------------------------------------------------
function
pw_Array_RemoveLast(arr)
{
    arr = arr.splice(arr.length-1, 1);
}

//------------------------------------------------------------------------------
function
pw_Array_RemoveAt(arr, i)
{
    arr = arr.splice(i, 1);
}

//------------------------------------------------------------------------------
function
pw_Array_RemoveIf(arr, pred)
{
    for(let i = 0; i < arr.length; ++i) {
        if(pred(arr[i])) {
            pw_Array_RemoveAt(arr, i);
            return;
        }
    }
}


//------------------------------------------------------------------------------
function
pw_Array_PushFront(arr, e)
{
    arr.unshift(e);
}

//------------------------------------------------------------------------------
function
pw_Array_PushBack(arr, e)
{
    arr.push(e);
}


//------------------------------------------------------------------------------
function
pw_Array_PopBack(arr)
{
    let e = pw_Array_GetBack(arr);
    arr = arr.splice(arr.length -1, 1);
    return e;
}

//------------------------------------------------------------------------------
function
pw_Array_PopFront(arr)
{
    let e = pw_Array_GetFront(arr);
    arr = arr.splice(0, 1);
    return e;
}
//------------------------------------------------------------------------------
function
pw_Array_Get(arr, i)
{
    if(i >= arr.length) {
        debugger;
    }

    if(i < 0) {
        i = (arr.length + i);
    }

    return arr[i];
}

//------------------------------------------------------------------------------
function
pw_Array_GetBack(arr)
{
    if(pw_Array_IsEmpty(arr)) {
        return null;
    }
    return arr[arr.length-1];
}

//------------------------------------------------------------------------------
function
pw_Array_GetFront(arr)
{
    if(pw_Array_IsEmpty(arr)) {
        return null;
    }
    return arr[0];
}

//------------------------------------------------------------------------------
function
pw_Array_MakeFlat(...args)
{
    let expanded_args = [];
    for(let i = 0; i < args.length; ++i) {
        const curr_arg = args[i];
        if(Array.isArray(curr_arg)) {
            const inner = pw_Array_MakeFlat(...curr_arg);
            expanded_args = expanded_args.concat(inner);
        } else {
            expanded_args.push(curr_arg);
        }
    }

    return expanded_args;
}
