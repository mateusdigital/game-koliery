//----------------------------------------------------------------------------//
// SceneSplash                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const SPLASH_SCENE_TEXT_EFFECT_DURATION_MS       = 1300;
const SPLASH_SCENE_TEXT_EFFECT_DELAY_DURATION_MS = 500;

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
                // @XXX
                setTimeout(()=>{
                    Go_To_Scene(SceneMenu);
                }, 400)
            });
    } // _SetupEffectTween

}; // class SceneSplash
