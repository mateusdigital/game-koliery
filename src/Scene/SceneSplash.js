//----------------------------------------------------------------------------//
// SceneSplash                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const SPLASH_SCENE_FONT_SIZE                     = 40;
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
        this.sceneTweenGroup = new TWEEN.Group();
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
    _OnIntroFinished()
    {
        this._Game.SetScene(new SceneMenu());
    } // _OnIntroFinished

    //--------------------------------------------------------------------------
    _CreateEffectTween()
    {
        let progress = {t: 0};
        const tween = new TWEEN.Tween(progress, this.sceneTweenGroup);
        return tween;
    } // _CreateEffectTween

    //--------------------------------------------------------------------------
    _SetupEffectTween()
    {
        let progress = {t: 0};
        let final    = {t: 1};

        this.effectTween
            .from(progress)
            .to(final, SPLASH_SCENE_TEXT_EFFECT_DURATION_MS)
            .delay(SPLASH_SCENE_TEXT_EFFECT_DELAY_DURATION_MS)
            .yoyo(true)
            .repeat(1)
            .onComplete(()=>{
                // @XXX
                setTimeout(()=>{
                    this._OnIntroFinished();
                }, 400)
            });
    } // _SetupEffectTween

}; // class SceneSplash
