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
        this.effectTween = this._CreateEffectTween();

        this.stdmattText = new Text("stdmatt",  SPLASH_SCENE_FONT_SIZE);
        this.stdmattText.filters = [
            new TextUncoverEffect (this.stdmattText,  this.effectTween),
            new TextGradientEffect(this.stdmattText,  chroma("black")   )
        ];

        this.presentsText = new Text("presents", SPLASH_SCENE_FONT_SIZE);
        this.presentsText.filters = [
            new TextUncoverEffect (this.presentsText,  this.effectTween),
            new TextGradientEffect(this.presentsText,  chroma("black")   )
        ];

        //
        // Initialize.
        const screen_size = Get_Screen_Size();

        this.stdmattText.pivot.set(0.5);
        this.stdmattText.x = (screen_size.x * 0.5);
        this.stdmattText.y = (screen_size.y * 0.5) - this.stdmattText.height;

        this.presentsText.pivot.set(0.5);
        this.presentsText.x = (screen_size.x * 0.5);
        this.presentsText.y = (screen_size.y * 0.5) + this.presentsText.height;

        this.addChild(this.stdmattText );
        this.addChild(this.presentsText);
    } // ctor

    //--------------------------------------------------------------------------
    _CreateEffectTween()
    {
        let progress = {t: 0};
        let final    = {t: 1};

        const tween = new TWEEN.Tween(progress)
            .to(final, SPLASH_SCENE_TEXT_EFFECT_DURATION_MS)
            .delay(SPLASH_SCENE_TEXT_EFFECT_DELAY_DURATION_MS)
            .yoyo(true)
            .repeat(1)
            .onComplete(()=>{
                g_Game.SetScene(new SceneHighScore());
            })
            .start();

        return tween;
    } // _CreateEffectTween
}; // class SceneSplash
