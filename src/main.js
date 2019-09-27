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


const GAME_DESIGN_WIDTH  = 700;
const GAME_DESIGN_HEIGHT = 600;

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
async function Preload()
{
    await LoadFont(
        "Commodore 64 Rounded",
        "./res/fonts/Commodore64Rounded.woff"
    );

    gPixiLoader.add([
        "res/textures/multi-color-raster.png",
        "res/textures/mask.png"
    ]).load(Setup);
}


let board = null;
let gameHud = null;
let starfield = null;

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

    // Board
    board = new Board();
    board.scale.set(0.7);
    board.x = screen_size.x / 2 - board.width / 2
    board.y = screen_size.y - board.height;

    // Game Hud
    gameHud = new GameHud();

    // Star field
    starfield = new Starfield(new PIXI.Rectangle(
        0,
        gameHud.y + gameHud.height,
        screen_size.x,
        screen_size.y - gameHud.y + gameHud.height
    ));

    gApp.stage.addChild(gameHud);
    gApp.stage.addChild(starfield);
    gApp.stage.addChild(board);
}


//------------------------------------------------------------------------------
function GameLoop(delta)
{
    // board.Update(delta);
    starfield.Update(delta);
    Update_Input();
    // gLevel.update(delta);
}

//----------------------------------------------------------------------------//
// Input Handlers                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function MouseMove(e)
{
    const pos = e.data.getLocalPosition(gApp.stage);
    // gameHud.x = pos.x;
    // gameHud.y = pos.y;
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
