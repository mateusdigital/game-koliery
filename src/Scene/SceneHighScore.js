//----------------------------------------------------------------------------//
// SceneHighScore                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const HIGHSCORE_SCENE_FONT_SIZE                     = 40;
const HIGHSCORE_SCENE_TEXT_EFFECT_DURATION_MS       = 300;
const HIGHSCORE_SCENE_TEXT_EFFECT_DELAY_DURATION_MS = 300;

//------------------------------------------------------------------------------
class SceneHighScore
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor(onFinishCallback)
    {
        super();

        //
        // iVars.
        // Properties.
        this.scoresInfo = [
            {name:"mm1", score:"99999"},
            {name:"mm2", score:"99999"},
            {name:"mm3", score:"99999"},
            {name:"mm4", score:"99999"},
            {name:"mm5", score:"99999"},
            {name:"mm6", score:"99999"},
            {name:"mm7", score:"99999"},
            {name:"mm8", score:"99999"},
            {name:"mm9", score:"99999"},
            {name:"m10", score:"99999"},
        ];
        this.titleText           = null;
        this.titleLine           = null;
        this.scoreTexts          = [];
        this.scoreTweenGroup     = new TWEEN.Group();
        this.sceneFinishCallback = onFinishCallback;

        //
        // Initialize.
        const screen_size = Get_Screen_Size();

        // Title Text.
        this.titleText = Create_Normal_Text("HIGH SCORES", 50);
        this.titleText.filters = [
            new TextGradientEffect(this.titleText, gPalette.GetScoreColor(0))
        ];
        this.titleText.x = (screen_size.x * 0.5);
        this.titleText.y = (this.titleText.height * 0.5) + 50;
        this.addChild(this.titleText);

        // Title Line.
        this.titleLine = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.titleLine.filters = [
            new TextGradientEffect(this.titleLine, chroma("#5a5a5a"))
        ];
        this.titleLine.width  = this.titleText.width;
        this.titleLine.height = 15;
        this.titleLine.x = this.titleText.x - (this.titleText.width  * 0.5);
        this.titleLine.y = this.titleText.y + (this.titleText.height * 0.5);

        this.addChild(this.titleLine);

        // Scores.
        this._CreateScoreUI();

        // Tween Completion.
        this.scoreTweenGroup.onComplete(()=>{
            onFinishCallback();
        });
    } // ctor


    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.scoreTweenGroup.update();
    } // Update


    //--------------------------------------------------------------------------
    _CreateScoreUI()
    {
        const screen_size = Get_Screen_Size();
        const initial_y   = this.titleLine.y + this.titleLine.height + 20;

        for(let i = 0; i < this.scoresInfo.length; ++i) {
            const info = this.scoresInfo[i];
            const str  = this._BuildScoreString(i + 1, info);
            const text = Create_Normal_Text(str, 40);

            const tween = this._CreateEffectTween(i + 1);
            tween.start();

            const color = chroma(gPalette.GetScoreColor(i));
            text.filters = [
                new TextUncoverEffect(text, tween),
                new TextGradientEffect(text, color)
            ];

            text.x = (screen_size.x * 0.5);
            text.y = initial_y + (text.height * i) + (text.height * 0.5);

            this.addChild(text);
            this.scoreTexts.push(text);
        }
    } // _CreateScoreUI

    //--------------------------------------------------------------------------
    _BuildScoreString(index, info)
    {
        const pos_str   = Build_Digits_String("", 2, index);
        const name_str  = info.name;
        const score_str = Build_Digits_String("", 5, info.score);

        return String_Cat(pos_str, ".", " ", name_str, " ", score_str);
    } // _BuildScoreString

    //--------------------------------------------------------------------------
    _CreateEffectTween(index)
    {
        let progress = {t: 0};
        let final    = {t: 1};

        const tween = new TWEEN.Tween(progress, this.scoreTweenGroup)
            .to(final, HIGHSCORE_SCENE_TEXT_EFFECT_DURATION_MS)
            .delay(HIGHSCORE_SCENE_TEXT_EFFECT_DELAY_DURATION_MS * index)
            .onUpdate(()=>{

            })
            .onComplete(()=>{
            })
            .start();

        return tween;
    } // _CreateEffectTween
}; // class SceneHighScore
