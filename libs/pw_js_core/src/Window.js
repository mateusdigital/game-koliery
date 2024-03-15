//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Window.js                                                     //
//  Project   : pw_js_core                                                    //
//  Date      : Mar 14, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const _PW_WINDOW_RESIZE_TIMEOUT_DURATION = 250;


//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let _pw_Window_ResizeHandlers          = new Set();
let _pw_Window_ResizeTimeoutId         = null;
let _pw_Window_ResizeCallbackInstalled = false;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Window_AddResizeHandler(handler)
{
    if(!_pw_Window_ResizeCallbackInstalled) {
       // @todo(stdmatt): Check why with addEventListener the events are not
       // getting propagated...
       // window.addEventListener("resize",
        window.onresize = ()=>{
            clearTimeout(_pw_Window_ResizeTimeoutId);
            _pw_Window_ResizeTimeoutId = setTimeout(()=>{
                for(let curr_handler of _pw_Window_ResizeHandlers) {
                    if(typeof(curr_handler) == "function") {
                        curr_handler();
                    } else {
                        curr_handler.OnWindowResize();
                    }
                }
            }, _PW_WINDOW_RESIZE_TIMEOUT_DURATION);
        }
        _pw_Window_ResizeCallbackInstalled = true;
    }

    _pw_Window_ResizeHandlers.add(handler);
}

//------------------------------------------------------------------------------
function
pw_Window_RemoveResizeHandler(handler)
{
    _pw_Window_ResizeHandlers.delete(handler);
}
