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

        // stdmatt Text.
        this.stdmattText = Create_Normal_Text("stdmatt",  SPLASH_SCENE_FONT_SIZE);
        this.stdmattText.filters = [
            new TextUncoverEffect (this.stdmattText,  this.effectTween),
            new TextGradientEffect(this.stdmattText,  chroma("black")   )
        ];

        // Presents Text.
        this.presentsText = Create_Normal_Text("presents", SPLASH_SCENE_FONT_SIZE);
        this.presentsText.filters = [
            new TextUncoverEffect (this.presentsText,  this.effectTween),
            new TextGradientEffect(this.presentsText,  chroma("black")   )
        ];

        //
        // Initialize.
        const screen_size = Get_Screen_Size();

        // stdmatt Text.
        this.stdmattText.pivot.set(0.5);
        this.stdmattText.x = (screen_size.x * 0.5);
        this.stdmattText.y = (screen_size.y * 0.5) - this.stdmattText.height;

        // Presents Text.
        this.presentsText.pivot.set(0.5);
        this.presentsText.x = (screen_size.x * 0.5);
        this.presentsText.y = (screen_size.y * 0.5) + this.presentsText.height;

        this.addChild(this.stdmattText );
        this.addChild(this.presentsText);

        this.starfield = new Starfield(new PIXI.Rectangle(0, 0, 500, 700));
        this.addChild(this.starfield);

    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.starfield.Update(dt);
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
        // const scene = new SceneHighScore(()=>{
        //     this._Game.PopScene();
        // });

        const scene = new SceneMenu();
        this._Game.PushScene(scene);
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
                this._OnIntroFinished();
            });
    }

}; // class SceneSplash
