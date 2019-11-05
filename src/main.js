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
function PreInit()
{
    Application_Create(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT);
}


//------------------------------------------------------------------------------
async function Preload()
{
    Texture_SetBasePath("res/textures/");
    RES_LoadResources(
        // Callback.
        Setup,
        // Fonts.
        FONTS_TO_LOAD,
        // Shaders
        "src/FX/Shaders/Debug.frag",
        "src/FX/Shaders/TextUncover.frag",
        "src/FX/Shaders/TextGradient.frag",
        "src/FX/Shaders/BoardBorder.frag",
        "src/FX/Shaders/BlockTint.frag",
        "src/FX/Shaders/BlockSquash.frag",
    );
}


//------------------------------------------------------------------------------
function Setup()
{
    //
    // Initialize RNG.
    Random_Seed();

    //
    // Initialize Scores.
    HIGHSCORE_MANAGER.FetchScores();

    //
    // Install the Input Handlers.
    Install_MouseHandlers   ();
    Install_KeyboardHandlers();
    g_App.stage.interactive = true;
    g_App.stage.buttonMode  = true;

    //
    // Initialize Audio.
    gAudio = new AudioPlayer();

    gAudio.PreloadSounds(MUSICS_TO_LOAD);
    Input_AddKeyboardListenerCallback((keyCode, isKeyDown)=>{
        if(keyCode == KEY_M && isKeyDown) {
            gAudio.ToggleMute();
        }
    });

    //
    // Initialize Game Objects
    // Palette.
    gPalette = new Palette();

    // Star field.
    const screen_size = Get_Screen_Size();
    gStarfield = new Starfield(new PIXI.Rectangle(
        0, 0, screen_size.x, screen_size.y
    ));
    g_App.stage.addChild(gStarfield);

    //
    // Start the game.
    Go_To_Scene(SceneSplash);
    // Go_To_Scene(SceneMenu);
    // Go_To_Scene(SceneGame, SCENE_GAME_LEVEL_EASY);
    // Go_To_Scene(SceneHighScore, null, HISCORE_SCENE_OPTIONS_EDITABLE);

    Application_Start(GameLoop);
}


//------------------------------------------------------------------------------
function GameLoop(delta)
{
    gStarfield.Update(delta);
}

//----------------------------------------------------------------------------//
// Input Handlers                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function MouseMove(e)
{
    gAudio.enabled = true;
}

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
PreInit();
Preload();
