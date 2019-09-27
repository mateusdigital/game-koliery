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
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const GAME_DESIGN_WIDTH  = 500;
const GAME_DESIGN_HEIGHT = 700;


//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let gApp         = null;
let gSpriteSheet = null;
let gPalette     = null;
let gBoard       = null;
let gBoardBorder = null;
let gGameHud     = null;
let gStarfield   = null;
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

font_names = null;
gFontIndex = 0;
//------------------------------------------------------------------------------
async function Preload()
{

    await LoadFont(
        "Commodore 64 Rounded",
        "./res/fonts/Commodore64Rounded.woff"
    );

    gPixiLoader.add([
        "res/textures/mask_0.png",
        "res/textures/mask_1.png",
        "res/textures/mask_2.png",
        "res/textures/mask_3.png",
    ]).load(Setup);
}


//------------------------------------------------------------------------------
function Setup()
{
    // Install the Input Handlers.
    Install_MouseHandlers   ();
    Install_KeyboardHandlers();

    // Install Game Loop callbacks.
    gApp.ticker.add(delta => GameLoop(gApp.ticker.deltaMS / 1000));

    const screen_size = Get_Screen_Size();
    const SCREEN_GAP = 10;

    //
    gPalette = new Palette();

    // Game Hud
    gGameHud = new GameHud();
    gGameHud.y += SCREEN_GAP;

    // Board
    const GAME_HUD_BOTTOM_Y = (gGameHud.y + gGameHud.height + SCREEN_GAP);
    gBoard       = new Board();
    gBoardBorder = new BoardBorder(gBoard);
    // gBoardBorder.scale.set((screen_size.y - GAME_HUD_BOTTOM_Y) / gBoardBorder.height);
    gBoardBorder.x = (screen_size.x / 2) - (gBoardBorder.width / 2);
    gBoardBorder.y = (GAME_HUD_BOTTOM_Y);

    // Star field
    gStarfield = new Starfield(new PIXI.Rectangle(
        0,
        gGameHud.y + gGameHud.height + SCREEN_GAP,
        screen_size.x,
        screen_size.y - gGameHud.y + gGameHud.height - SCREEN_GAP
    ));

    gApp.stage.addChild(gGameHud  );
    gApp.stage.addChild(gStarfield);
    gApp.stage.addChild(gBoardBorder);
}


//------------------------------------------------------------------------------
function GameLoop(delta)
{
    gBoard.Update(delta);
    gStarfield.Update(delta);
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
    // gGameHud.x = pos.x;
    // gGameHud.y = pos.y;
    gFontIndex = pos.y;

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
