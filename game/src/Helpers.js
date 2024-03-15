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
// Game General Functions                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Get_Screen_Size()
{
    // @TODO(stdmatt): cache the values...
    // return pw_Vector_Create(document.documentElement.clientWidth, document.documentElement.clientHeight);
    // return pw_Vector_Create(window.innerWidth, window.innerHeight);

    return pw_Vector_Create(document.documentElement.clientWidth, document.documentElement.clientHeight);
}

//------------------------------------------------------------------------------
function Get_Design_Size()
{
    return pw_Vector_Create(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT);
}

//------------------------------------------------------------------------------
function Get_Actual_Size()
{
    return pw_Vector_Create(_actualWidth(), _actualHeight());
}

//------------------------------------------------------------------------------
// https://coderevue.net/posts/scale-to-fit-screen-pixijs/
//------------------------------------------------------------------------------
function _actualWidth() {
    const size = Get_Screen_Size();
    const design = Get_Design_Size();

    const isWidthConstrained = size.x < size.y * (design.x / design.y);
    return isWidthConstrained ? size.x : size.y * (design.x / design.y);
}

//------------------------------------------------------------------------------
function _actualHeight() {
    const size = Get_Screen_Size();
    const design = Get_Design_Size();

    const isHeightConstrained = size.x * (design.y / design.x) > size.y;
    return isHeightConstrained ? size.y : size.x * (design.y / design.x);
  }



//------------------------------------------------------------------------------
function Go_To_Scene(...args)
{
    const scene_class = args[0];
    pw_Array_RemoveFront(args);

    const scene = new scene_class(...args);
    PW_SCENE_MANAGER.SetScene(scene);
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
    let value_str = value.toString().substr(0, digits);

    return pw_String_Cat(
        prefix.toUpperCase(),
        "0".repeat(digits - value_str.length),
        value_str
    );
}
