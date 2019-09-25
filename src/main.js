//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : main.js                                                       //
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
// Globals                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let gApp         = null;
let gSpriteSheet = null;
let gPalette     = null;
// Pixi aliases
let gPixiLoader    = null;
let gPixiLoaderRes = null;

//------------------------------------------------------------------------------
function PreInit()
{
    // Create the Pixi application.
    gApp = new PIXI.Application({
        width  : GAME_DESIGN_WIDTH,
        height : GAME_DESIGN_HEIGHT
    });

    document.body.appendChild(gApp.view);

    // Set the PIXI aliases.
    gPixiLoader    = PIXI.Loader.shared;
    gPixiLoaderRes = PIXI.Loader.shared.resources;
}

//------------------------------------------------------------------------------
function Preload()
{
    gPixiLoader.add([
        "res/textures/pieces/1.png",
        "res/textures/pieces/2.png",
        "res/textures/pieces/3.png",
        "res/textures/pieces/4.png",
        "res/textures/pieces/5.png",
    ]).load(Setup);
}
let board = null;

//------------------------------------------------------------------------------
function Setup()
{
    // Install the Input Handlers.
    Install_MouseHandlers   ();
    Install_KeyboardHandlers();

    // Install Game Loop callbacks.
    gApp.ticker.add(delta => GameLoop(gApp.ticker.deltaMS / 1000));

    //
    gPalette = new Palette();



    let screen_size = Get_Screen_Size();
    board = new Board();
    board.x = screen_size.x / 2 - board.width / 2
    board.y = screen_size.y / 2 - board.height / 2;
    // board.x = screen_size.x / 2 - board.width / 2;
    gApp.stage.addChild(board);


}


//------------------------------------------------------------------------------
function GameLoop(delta)
{
    board.Update(delta);
    Update_Input();
    // gLevel.update(delta);
}

//----------------------------------------------------------------------------//
// Input Handlers                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function MouseMove(e)
{
}

//------------------------------------------------------------------------------
function MouseClick(e)
{
}

//------------------------------------------------------------------------------
function KeyboardDown(e)
{
}

//------------------------------------------------------------------------------
function KeyboardUp(e)
{
}

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
PreInit();
Preload();
