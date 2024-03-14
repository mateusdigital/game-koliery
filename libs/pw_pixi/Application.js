//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
PW_APPLICATION_MAX_DELTA_TIME = 1/30;

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let _pw_App = null;

let pw_Application_Total_Time  = 0;
let pw_Application_Delta_Time  = 0;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
pw_Application_Create(width, height, seed=null)
{
    _pw_App = new PIXI.Application({
        width  : width,
        height : height
    });

    document.body.appendChild(_pw_App.view);
    if((typeof __PW_HACK_PIXI_PARTICLES_INIT) == "function") {
        __PW_HACK_PIXI_PARTICLES_INIT(PIXI);
    }

    _pw_App.stage.interactive = true;
    _pw_App.stage.buttonMode  = true;

    pw_Application_Tween_Group = pw_Tween_CreateGroup();

    pw_Input_InstallBasicMouseHandler   ();
    pw_Input_InstallBasicKeyboardHandler();

    pw_Random_Seed(seed);


    window.addEventListener('resize', __resize);
}

//------------------------------------------------------------------------------
function
__resize() {

    const width  = window.innerWidth;
    const height =  window.innerHeight

    _pw_App.renderer.resize(width, height);
    PW_SCENE_MANAGER.Resize(width, height);

}

//------------------------------------------------------------------------------
function
pw_Application_Start()
{
    _pw_App.ticker.add(
        delta => {
            dt = _pw_App.ticker.deltaMS / 1000;
            if(dt > PW_APPLICATION_MAX_DELTA_TIME) {
                dt = PW_APPLICATION_MAX_DELTA_TIME;
            }

            pw_Application_Delta_Time  = dt;
            pw_Application_Total_Time += dt;

            PW_SCENE_MANAGER.Update(dt);

            pw_Tween_Update(dt);
            pw_Input_KeyboardEndFrame();
        }
    );
}

//------------------------------------------------------------------------------
function
pw_Application_GetStage()
{
    return _pw_App.stage;
}
