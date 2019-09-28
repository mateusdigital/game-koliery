//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Input.js                                                      //
//  Project   : columns                                                       //
//  Date      : Sep 25, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//


//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const KEY_ARROW_LEFT  = 37;
const KEY_ARROW_UP    = 38;
const KEY_ARROW_RIGHT = 39;
const KEY_ARROW_DOWN  = 40;
//------------------------------------------------------------------------------
const KEY_SPACE = 32;
const KEY_ENTER = 13;

//----------------------------------------------------------------------------//
// Vars                                                                       //
//----------------------------------------------------------------------------//
let PrevKeyboard = [];
let Keyboard     = [];

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Install_MouseHandlers()
{
    gApp.stage.interactive = true;
    gApp.stage.buttonMode  = true;

    gApp.stage.on("mousemove",   MouseMove);
    gApp.stage.on("pointerdown", MouseClick);
}

//------------------------------------------------------------------------------
function Install_KeyboardHandlers()
{
    window.addEventListener(
        "keydown",
        (e) => {
            // e.preventDefault();
            PrevKeyboard[e.keyCode] = Keyboard[e.keyCode];
            Keyboard    [e.keyCode] = true;

            KeyboardDown(e);
        },
        false
    );

    window.addEventListener(
        "keyup",
        (e) => {
            // e.preventDefault();
            PrevKeyboard[e.keyCode] = Keyboard[e.keyCode];
            Keyboard    [e.keyCode] = false;
            KeyboardUp(e);
        },
        false
    );
}

//------------------------------------------------------------------------------
function Update_Input()
{
    // @XXX(stdmatt): Cheesy... how to make the events based input
    // be available all the frames????
    for(let k of Keyboard.keys()) {
        PrevKeyboard[k] = Keyboard[k];
    }
}

//------------------------------------------------------------------------------
function IsKeyDown(keyCode)
{
    return Keyboard[keyCode] == true;
}

//------------------------------------------------------------------------------
function IsKeyUp(keyCode)
{
    return Keyboard[keyCode] == false;
}

//------------------------------------------------------------------------------
function IsKeyPress(keyCode)
{
    return Keyboard[keyCode] == true && PrevKeyboard[keyCode] == false;
}
