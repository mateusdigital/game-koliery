//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : SceneSplash.js                                                //
//  Project   : columns                                                       //
//  Date      : Oct 08, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// SceneSplash                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const SPLASH_SCENE_TEXT_EFFECT_DURATION_MS         = 1300;
const SPLASH_SCENE_TEXT_EFFECT_DELAY_DURATION_MS   = 500;
const SPLASH_SCENE_DELAY_TO_GO_TO_ANOTHER_SCENE_MS = 500;

const SPLASH_SCENE_FONT_SIZE = 40;


//------------------------------------------------------------------------------
class SceneSplash
    extends pw_Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // iVars.
        // Properties.
        this.sceneTweenGroup = pw_Tween_CreateGroup();
        this.effectTween     = this._CreateEffectTween();

        // Texts.
        this.stdmattText  = new pw_Text("MATEUSDIGITAL",  FONT_COMMODORE, SPLASH_SCENE_FONT_SIZE);
        this.presentsText = new pw_Text("PRESENTS", FONT_COMMODORE, SPLASH_SCENE_FONT_SIZE);

        //
        // Initialize.
        const screen_size = Get_Design_Size();
        const color       = gPalette.GetMenuTextNormalColor();

        // stdmatt Text.
        pw_Anchor_Center(this.stdmattText);
        this.stdmattText.x = (screen_size.x * 0.5);
        this.stdmattText.y = (screen_size.y * 0.5) - this.stdmattText.height;

        Apply_TextUncoverEffect (this.stdmattText, this.effectTween);
        Apply_TextGradientEffect(this.stdmattText, color           );

        // Presents Text.
        pw_Anchor_Center(this.presentsText);
        this.presentsText.x = (screen_size.x * 0.5);
        this.presentsText.y = (screen_size.y * 0.5) + this.presentsText.height;

        Apply_TextUncoverEffect (this.presentsText, this.effectTween);
        Apply_TextGradientEffect(this.presentsText, color           );

        this.addChild(this.stdmattText );
        this.addChild(this.presentsText);

        gStarfield.SetSpeedModifier(1);
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        gStarfield.Update(dt);

        if(pw_Keyboard_IsClick(PW_KEY_SPACE) || pw_Keyboard_IsClick(PW_KEY_ENTER)) {
            Go_To_Scene(SceneMenu);
        }

        this.sceneTweenGroup.update();
    } // Update

    //--------------------------------------------------------------------------
    OnEnter()
    {
        this._SetupEffectTween();
        this.StartIntro();
    } // OnEnter


    //--------------------------------------------------------------------------
    StartIntro()
    {
        this.effectTween.start();
    } // StartIntro


    //--------------------------------------------------------------------------
    _CreateEffectTween()
    {
        const tween = pw_Tween_CreateBasic(
            SPLASH_SCENE_TEXT_EFFECT_DURATION_MS,
            this.sceneTweenGroup
        );

        return tween;
    } // _CreateEffectTween

    //--------------------------------------------------------------------------
    _SetupEffectTween()
    {
        this.effectTween
            .delay(SPLASH_SCENE_TEXT_EFFECT_DELAY_DURATION_MS)
            .yoyo(true)
            .repeat(1)
            .onComplete(()=>{
                // @XXX This should be encapsulated in a library functionality.
                 // This way the application will have control how to handle
                 // the timing itself. Right now I have no idea what's behind
                 // the setTimeout function.
                setTimeout(()=>{
                    Go_To_Scene(SceneMenu);
                }, SPLASH_SCENE_DELAY_TO_GO_TO_ANOTHER_SCENE_MS)
            });
    } // _SetupEffectTween

}; // class SceneSplash
