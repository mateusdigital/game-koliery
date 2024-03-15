//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : String.js                                                     //
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
// String                                                                     //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const PW_STR_DONT_IGNORE_CASE = 0;
const PW_STR_IGNORE_CASE      = 1;

//------------------------------------------------------------------------------
function
pw_String_ToUpper(str)
{
    return str.toUpperCase();
}

//------------------------------------------------------------------------------
function
pw_String_Cat()
{
    let s = "";
    for(let i = 0; i < arguments.length; ++i) {
        s += arguments[i];
    }
    return s;
}

//------------------------------------------------------------------------------
function
pw_String_Contains(haystack, needle, ignore_case = PW_STR_DONT_IGNORE_CASE)
{
    if(needle.length == 0) {
        return false;
    }
    if(haystack.length < needle.length) {
        return false;
    }

    if(ignore_case != PW_STR_DONT_IGNORE_CASE) {
        return haystack.toLowerCase().includes(needle.toLowerCase());
    }

    return haystack.includes(needle);
}


//------------------------------------------------------------------------------
function
pw_String_Join(sep, ...args)
{
    let s = "";
    for(let i = 0; i < args.length-1; ++i) {
        s += args[i] + sep;
    }
    s += pw_Array_GetBack(args);

    return s;
}
