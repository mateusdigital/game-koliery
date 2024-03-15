//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Input.js                                                      //
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
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const PW_KEY_ARROW_LEFT  = 37;
const PW_KEY_ARROW_UP    = 38;
const PW_KEY_ARROW_RIGHT = 39;
const PW_KEY_ARROW_DOWN  = 40;
//------------------------------------------------------------------------------
const PW_KEY_BACKSPACE = 8;
const PW_KEY_ESC       = 27;
const PW_KEY_SPACE     = 32;
const PW_KEY_ENTER     = 13;
//------------------------------------------------------------------------------
const PW_KEY_0 = 48;
const PW_KEY_1 = 49;
const PW_KEY_2 = 50;
const PW_KEY_3 = 51;
const PW_KEY_4 = 52;
const PW_KEY_5 = 53;
const PW_KEY_6 = 54;
const PW_KEY_7 = 55;
const PW_KEY_8 = 56;
const PW_KEY_9 = 57;
//------------------------------------------------------------------------------
const PW_KEY_A = 65;
const PW_KEY_B = 66;
const PW_KEY_C = 67;
const PW_KEY_D = 68;
const PW_KEY_E = 69;
const PW_KEY_F = 70;
const PW_KEY_G = 71;
const PW_KEY_H = 72;
const PW_KEY_I = 73;
const PW_KEY_J = 74;
const PW_KEY_K = 75;
const PW_KEY_L = 76;
const PW_KEY_M = 77;
const PW_KEY_N = 78;
const PW_KEY_O = 79;
const PW_KEY_P = 80;

//------------------------------------------------------------------------------
const PW_MOUSE_BUTTON_INDEX_LEFT  = 0;
const PW_MOUSE_BUTTON_INDEX_RIGHT = 2;


//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let pw_Mouse_X = 0;
let pw_Mouse_Y = 0;
let pw_Mouse_IsClicked      = false;
let pw_Mouse_IsRightClicked = false;
let pw_Mouse_IsDown         = false;
let pw_Mouse_WheelY         = 0;

let pw_CurrKeyboard = new Map();
let pw_PrevKeyboard = new Map();
let _pw_KeyboardClick = new Map();
// @bug(stdmatt): pw_Mouse_IsClicked never gets false after the mouse clicks
// first time. We need to find a way to make sure that the click remains
// only for the frame.

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Input_InstallBasicMouseHandler(htmlElement)
{
    if(!htmlElement) {
        htmlElement = document.body;
    }

    // Move
    htmlElement.addEventListener("mousemove", function(e) {
        var r = htmlElement.getBoundingClientRect();
        pw_Mouse_X = (e.clientX - r.left) / (r.right  - r.left) * htmlElement.width;
        pw_Mouse_Y = (e.clientY - r.top ) / (r.bottom - r.top ) * htmlElement.height;

        if(typeof(OnMouseMove) == "function") {
            OnMouseMove();
        }
    }, false);


    // Left Mouse Click
    htmlElement.addEventListener("click", event => {
        pw_Mouse_IsClicked = true;
        if(typeof(OnMouseClick) == "function") {
            OnMouseClick();
        }
    });

    // Right Mouse Click
    htmlElement.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        pw_Mouse_IsRightClicked = true;
        if(typeof(OnMouseRightClick) == "function") {
            OnMouseRightClick();
        }
    }, false);

    // Mouse Down
    htmlElement.addEventListener("mousedown", event => {
        pw_Mouse_IsDown = true;
        if(typeof(OnMouseDown) == "function") {
            OnMouseDown();
        }
    });

    // Mouse Up
    htmlElement.addEventListener("mouseup", event => {
        pw_Mouse_IsDown = false;
        if(typeof(OnMouseUp) == "function") {
            OnMouseUp();
        }
     });

     // Mouse Whell
     htmlElement.addEventListener("wheel", event => {
        // pw_Mouse_WheelX += event.wheelDeltaX;
        pw_Mouse_WheelY += event.wheelDeltaY;
        if(typeof(OnMouseWheel) == "function") {
            OnMouseWheel(event.wheelDeltaX, event.wheelDeltaY);
        }
     });
}

//------------------------------------------------------------------------------
function
_pw_Input_ChangeKey(key, press)
{
    const previous = pw_CurrKeyboard.get(key);
    pw_PrevKeyboard.set(key, previous);
    pw_CurrKeyboard.set(key, press);

    if(press && previous != press) {
        _pw_KeyboardClick.set(key, true);
    }

    // dlog(
    //     "Previous:", previous,
    //     "Prev: ", pw_PrevKeyboard.get(key),
    //     "Curr: ", pw_CurrKeyboard.get(key)
    // );
}

//------------------------------------------------------------------------------
function
pw_Input_InstallBasicKeyboardHandler(htmlElement)
{
    if(!htmlElement) {
        htmlElement = window;
    }

    // Keydown.
    htmlElement.addEventListener('keydown', (event) => {
        if(event.repeat) {
            return;
        }
        _pw_Input_ChangeKey(event.keyCode, true);

        if(PW_SCENE_MANAGER && PW_SCENE_MANAGER.currScene) {
            if(typeof(PW_SCENE_MANAGER.currScene.OnKeyDown) == "function") {
                PW_SCENE_MANAGER.currScene.OnKeyDown(event.keyCode);
            }
        }
    });

    // Keyup.
    htmlElement.addEventListener('keyup', (event) => {
        _pw_Input_ChangeKey(event.keyCode, false);
        if(PW_SCENE_MANAGER && PW_SCENE_MANAGER.currScene) {
            if(typeof(PW_SCENE_MANAGER.currScene.OnKeyUp) == "function") {
                PW_SCENE_MANAGER.currScene.OnKeyUp(event.keyCode);
            }
        }
    });
}

//------------------------------------------------------------------------------
function
pw_Keyboard_IsDown(code)
{
    return pw_CurrKeyboard.get(code);
}

//------------------------------------------------------------------------------
function
pw_Keyboard_IsUp(code)
{
    return !pw_CurrKeyboard.get(code);
}

//------------------------------------------------------------------------------
function
pw_Keyboard_IsClick(code)
{
    return _pw_KeyboardClick.has(code);
}

//------------------------------------------------------------------------------
function
pw_Input_KeyboardEndFrame()
{
    // @improve: This should generate a lot of junk...
    // for(let k of pw_Keyboard.keys()) {
    //     pw_Keyboard.set(k, false);
    // }
    _pw_KeyboardClick = new Map();
}
