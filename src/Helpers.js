//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Helpers.js                                                    //
//  Project   : match3                                                        //
//  Date      : Sep 23, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//


//----------------------------------------------------------------------------//
//                                                                            //
// Game General Constants                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const HISCORE_MAX_DIGITS = 5;



//----------------------------------------------------------------------------//
//                                                                            //
// Game General Functions                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Get_Screen_Size()
{
    // @TODO(stdmatt): cache the values...
    return Vector_Create(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT);
}


//------------------------------------------------------------------------------
function Points_Are_Orthogonal(p1, p2)
{
    return p1.x == p2.x || p1.y == p2.y;
}

//------------------------------------------------------------------------------
function Points_Are_Valid_For_Swap(p1, p2)
{
    if(!Points_Are_Orthogonal(p1, p2)) {
        return false;
    }

    let dx = Math.abs(p1.x - p2.x);
    let dy = Math.abs(p1.y - p2.y);

    return (dx == 1 && dy == 0)
        || (dx == 0 && dy == 1);
}

//------------------------------------------------------------------------------
function Build_Digits_String(prefix, digits, value)
{
    const value_str = value.toString();
    return String_Cat(
        prefix.toUpperCase(),
        "0".repeat(digits - value_str.length),
        value
    );
}
