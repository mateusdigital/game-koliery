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
        SHADERS_TO_LOAD,
    );
}


//------------------------------------------------------------------------------
function
Setup()
{
    // //
    // // Initialize Scores.
    // HIGHSCORE_MANAGER.FetchScores();

    //
    // Initialize Audio.
    gAudio = new AudioPlayer();
    gAudio.PreloadSounds(SOUNDS_TO_LOAD, MUSIC_TO_LOAD);

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

    PW_SCENE_MANAGER.RegisterScenes(
        SceneSplash,
        SceneMenu,
        SceneGame,
        SceneHighScore,
        SceneCredits
    );

    if(!PW_SCENE_MANAGER.StartWithQueryString()){
        Go_To_Scene(SceneSplash);
    }

    pw_Application_Start(GameLoop);
}


//------------------------------------------------------------------------------
function
GameLoop(delta)
{
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
