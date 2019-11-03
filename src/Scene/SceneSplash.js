//----------------------------------------------------------------------------//
// SceneSplash                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const SPLASH_SCENE_TEXT_EFFECT_DURATION_MS         = 1300;
const SPLASH_SCENE_TEXT_EFFECT_DELAY_DURATION_MS   = 500;
const SPLASH_SCENE_DELAY_TO_GO_TO_ANOTHER_SCENE_MS = 500;

//------------------------------------------------------------------------------
class SceneSplash
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // iVars.
        // Properties.
        this.sceneTweenGroup = Tween_CreateGroup();
        this.effectTween     = this._CreateEffectTween();

        // Texts.
        this.stdmattText  = Create_Normal_Text("stdmatt",  SPLASH_SCENE_FONT_SIZE);
        this.presentsText = Create_Normal_Text("presents", SPLASH_SCENE_FONT_SIZE);

        //
        // Initialize.
        const screen_size = Get_Screen_Size();
        const color       = chroma("black");

        // stdmatt Text.
        this.stdmattText.pivot.set(0.5);
        this.stdmattText.x = (screen_size.x * 0.5);
        this.stdmattText.y = (screen_size.y * 0.5) - this.stdmattText.height;

        Apply_TextUncoverEffect (this.stdmattText, this.effectTween);
        Apply_TextGradientEffect(this.stdmattText, color           );

        // Presents Text.
        this.presentsText.pivot.set(0.5);
        this.presentsText.x = (screen_size.x * 0.5);
        this.presentsText.y = (screen_size.y * 0.5) + this.presentsText.height;

        Apply_TextUncoverEffect (this.presentsText, this.effectTween);
        Apply_TextGradientEffect(this.presentsText, color           );

        this.addChild(this.stdmattText );
        this.addChild(this.presentsText);
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(IsKeyPress(KEY_SPACE) || IsKeyPress(KEY_ENTER)) {
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
        const tween = Tween_CreateBasic(
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
