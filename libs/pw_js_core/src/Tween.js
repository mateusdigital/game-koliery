//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Tween.js                                                      //
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
// Variables                                                                  //
//----------------------------------------------------------------------------//
const PW_TWEEN_DEFAULT_GROUP = pw_Tween_CreateGroup();

let _pw_Tween_Total_Time = 0;
let _pw_Tween_Delta_Time = 0;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Tween_Update(dt)
{
    _pw_Tween_Delta_Time  = dt;
    _pw_Tween_Total_Time += dt;

    if(PW_TWEEN_DEFAULT_GROUP._started) {
        PW_TWEEN_DEFAULT_GROUP.update();
    }
}

//------------------------------------------------------------------------------
function
pw_Tween_CreateBasic(time, group)
{
    const curr = {value: 0};
    const end  = {value: 1};

    if(!group) {
        group = PW_TWEEN_DEFAULT_GROUP;
    }

    const tween = new TWEEN.Tween(curr, group).to(end, time);
    return tween;
}

//------------------------------------------------------------------------------
function
pw_Tween_Create(group)
{
    if(!group) {
        group = PW_TWEEN_DEFAULT_GROUP;
    }
    return new TWEEN.Tween(null, group);
}

//------------------------------------------------------------------------------
function
pw_Tween_CreateGroup()
{
    return new TWEEN.Group();
}
