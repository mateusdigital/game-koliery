//----------------------------------------------------------------------------//
// SceneMenu                                                                  //
//----------------------------------------------------------------------------//
const SCENE_MENU_TITLE_STR           = "koliery";
const SCENE_MENU_TITLE_FONT_SIZE     = 90;
const SCENE_MENU_TITLE_SIN_AMPLITUDE = 20;
const SCENE_MENU_TITLE_SIN_FREQUENCY = 1;
const SCENE_MENU_LEVEL_FONT_SIZE     = 40;
const SCENE_MENU_MARQUEE_FONT_SIZE   = 25;

const SCENE_MENU_MARQUEE_TWEEN_DURATION_MS     = 500;
const SCENE_MENU_MARQUEE_TWEEN_DELAY_MS        = 500;
const SCENE_MENU_MARQUEE_TWEEN_REPEAT_DELAY_MS = 2000;

//------------------------------------------------------------------------------
class SceneMenu
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // iVars.
        // Title Text.
        this.titleText             = []
        this.titleTextLayer        = new PIXI.Container();
        this.titleTextSinAmplitude = SCENE_MENU_TITLE_SIN_AMPLITUDE;
        this.titleTextSinFrequency = SCENE_MENU_TITLE_SIN_FREQUENCY;

        // Level Text.
        this.levelText       = [];
        this.levelTextLayer  = new PIXI.Container();
        this.levelTweenGroup = Tween_CreateGroup();

        // Marquee Text.
        this.marqueeStrings = [
            "DEVELOPED BY",
            "STDMATT",
            // "",
            "THANKS TO",
            "ALEX",
            // "",
            "GREETINGS TO THE FRIENDS",
            "OF PROGRAMMERS HIDEOUT",
            // "",
            "AND A BIG BIG KISS",
            "TO MY MOM AND PINGO",
            "-- I MISS YOU --",
            "",
            "",
        ];
        this.marqueeText       = null;
        this.marqueeTween      = null;
        this.marqueeTextIndex  = 0;
        this.marqueeTweenGroup = Tween_CreateGroup();

        //
        // Initialize.
        this._InitializeTitleText  ();
        this._InitializeLevelText  ();
        this._InitializeMarqueeText();

    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(IsKeyPress(KEY_1)) {
            Go_To_Scene(SceneGame, SCENE_GAME_LEVEL_EASY);
        } else if(IsKeyPress(KEY_2)) {
            Go_To_Scene(SceneGame, SCENE_GAME_LEVEL_MEDIUM);
        } else if(IsKeyPress(KEY_3)) {
            Go_To_Scene(SceneGame, SCENE_GAME_LEVEL_HARD);
        } else if(IsKeyPress(KEY_H)){
            Go_To_Scene(SceneHighScore, SceneMenu, HISCORE_SCENE_OPTIONS_NONE);
        }

        // Tweens.
        this.levelTweenGroup  .update();
        this.marqueeTweenGroup.update();

        // Title.
        for(let i = 0; i < this.titleText.length; ++i) {
            const text = this.titleText[i];
            const len_i = (this.titleText.length - i);

            const value = -Math_Sin(
                (Application_Total_Time * MATH_2PI + len_i) / this.titleTextSinFrequency
            );

            text.y = (value * this.titleTextSinAmplitude);
        }
    } // Update


    //--------------------------------------------------------------------------
    _InitializeTitleText()
    {
        const str_len = SCENE_MENU_TITLE_STR.length;
        for(let i = 0; i < str_len; ++i) {
            const c     = SCENE_MENU_TITLE_STR[i];
            const color = chroma.hsl((360 / str_len) * i, 0.5, 0.5);
            const text  = Create_Title_Text(c, SCENE_MENU_TITLE_FONT_SIZE, color.num());

            let prev_x = 0;
            let prev_w = 0;
            if(i > 0) {
                prev_x = this.titleText[i-1].x;
                prev_w = this.titleText[i-1].width;
            }

            text.x = (prev_x + prev_w);

            this.titleTextLayer.addChild(text);
            this.titleText.push(text);
        }

        const screen_size = Get_Screen_Size();
        this.titleTextLayer.pivot.set(
            this.titleTextLayer.width  * 0.5,
            this.titleTextLayer.height * 0.5
        );
        this.titleTextLayer.x = (screen_size.x * 0.50)
        this.titleTextLayer.y = (screen_size.y * 0.30) - (this.titleTextSinAmplitude * 2);

        this.addChild(this.titleTextLayer);
    } // _InitializeTitleText

    //--------------------------------------------------------------------------
    _InitializeLevelText()
    {
        const strs        = ["1 - EASY", "2 - MEDIUM", "3 - HARD", "h - scores"];
        const screen_size = Get_Screen_Size();

        for(let i = 0; i < strs.length; ++i) {
            // Tween.
            // @XXX
            const tween = Tween_CreateBasic(200, this.levelTweenGroup)
                .delay(300 * (i + 1))
                .start();

            // Text.
            const str   = strs[i];
            const text  = Create_Normal_Text(str, SCENE_MENU_LEVEL_FONT_SIZE);
            const color = chroma("black");

            Apply_TextUncoverEffect (text, tween);
            Apply_TextGradientEffect(text, color);

            text.anchor.set(0.0, 0.5);
            text.x = 0;
            text.y = (text.height * i);

            this.levelText.push(text);
            this.levelTextLayer.addChild(text);
        }

        // Text Layer.
        this.levelTextLayer.pivot.set(this.levelTextLayer.width  * 0.5, 0);
        this.levelTextLayer.x = (screen_size.x * 0.5);
        this.levelTextLayer.y = (screen_size.y * 0.5);

        this.addChild(this.levelTextLayer);

        // Tween Group
        this.levelTweenGroup.onComplete(()=>{
            this._SetupMarqueeTween();
        });
    } // _InitializeLevelText

    //--------------------------------------------------------------------------
    _InitializeMarqueeText()
    {
        // Tween.
        this.marqueeTween = Tween_CreateBasic(
            SCENE_MENU_MARQUEE_TWEEN_DURATION_MS,
            this.marqueeTweenGroup
        );

        // Text.
        const screen_size = Get_Screen_Size();
        const str         = this.marqueeStrings[0];
        const color       = chroma("black");

        this.marqueeText = Create_Title_Text(str, SCENE_MENU_MARQUEE_FONT_SIZE);
        Apply_TextUncoverEffect (this.marqueeText, this.marqueeTween);
        Apply_TextGradientEffect(this.marqueeText, color            );

        this.marqueeText.anchor.set(0.5, 0.5);
        this.marqueeText.x = screen_size.x * 0.5;
        this.marqueeText.y = screen_size.y * 0.95;

        this.addChild(this.marqueeText);
    } // _InitializeMarqueeText

    //--------------------------------------------------------------------------
    _SetupMarqueeTween()
    {
        this.marqueeTween
            .delay(SCENE_MENU_MARQUEE_TWEEN_DELAY_MS)
            .repeatDelay(SCENE_MENU_MARQUEE_TWEEN_REPEAT_DELAY_MS)
            .yoyo(true)
            .repeat(1)
            .onStart(()=>{
                const strings_len = this.marqueeStrings.length;
                const index       = this.marqueeTextIndex;

                // @XXX
                const color = chroma.hsl((360 / strings_len) * index, 0.5, 0.5);
                this.marqueeText.filters[1].SetColor(color);

                this.marqueeTextIndex = (index + 1) % strings_len;
                this.marqueeText.text = this.marqueeStrings[index];

                // @notice(stdmatt): After we loop thru all the marquee texts
                // go to another scene.
                if(this.marqueeTextIndex == 0) {
                    Go_To_Scene(
                        SceneHighScore,
                        SceneMenu,
                        HISCORE_SCENE_OPTIONS_GO_BACK_AUTOMATICALLY
                    );
                }
            })
            .start();

            this.marqueeTweenGroup.onComplete(()=>{
                this._SetupMarqueeTween();
            });
    } // _SetupMarqueeTween
}; // class SceneMenu
