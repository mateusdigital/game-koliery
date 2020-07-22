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
let gPalette     = null;
let gStarfield   = null;
let gAudio       = null;

//------------------------------------------------------------------------------
function
PreInit()
{
    pw_Application_Create(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT);
}


//------------------------------------------------------------------------------
async function
Preload()
{
    pw_RES_LoadResources(
        Setup,
        TEXTURES_TO_LOAD,
        FONTS_TO_LOAD,
        SHADERS_TO_LOAD
    );
}


//------------------------------------------------------------------------------
function
Setup()
{
    //
    // Initialize RNG.
    pw_Random_Seed();

    //
    // Initialize Scores.
    HIGHSCORE_MANAGER.FetchScores();

    //
    // Install the Input Handlers.
    pw_Input_InstallBasicMouseHandler   ();
    pw_Input_InstallBasicKeyboardHandler();

    //
    // Initialize Audio.
    gAudio = new AudioPlayer();
    gAudio.PreloadSounds(SOUNDS_TO_LOAD);

    //
    // Initialize Game Objects
    // Palette.
    gPalette = new Palette();

    // Star field.
    const screen_size = Get_Screen_Size();
    gStarfield = new Starfield(new PIXI.Rectangle(
        0, 0, screen_size.x, screen_size.y
    ));
    pw_Application_GetStage().addChild(gStarfield);

    //
    // Start the game.
    // Go_To_Scene(SceneSplash);
    // Go_To_Scene(SceneMenu);
    Go_To_Scene(SceneGame, SCENE_GAME_LEVEL_EASY);
    // Go_To_Scene(SceneHighScore, null, SCENE_HIGHSCORE_OPTIONS_EDITABLE);
    // Go_To_Scene(SceneCredits);
    pw_Application_Start(GameLoop);
}


//------------------------------------------------------------------------------
function
GameLoop(delta)
{
    gStarfield.Update(delta);
    pw_Input_KeyboardEndFrame();
}


//----------------------------------------------------------------------------//
// Input Handlers                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
MouseMove(e)
{
    gAudio.enabled = true;
}

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
PreInit();
Preload();
