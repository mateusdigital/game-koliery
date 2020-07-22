//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : GameHud.js                                                    //
//  Project   : columns                                                       //
//  Date      : Sep 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//


//----------------------------------------------------------------------------//
// GameHud                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const GAME_HUD_TEXT_PREFIX_SCORE = "Score:";
const GAME_HUD_TEXT_PREFIX_HI    = "Hi   :";
const GAME_HUD_TEXT_PREFIX_LEVEL = "Level ";
const GAME_HUD_TEXT_GAME_NAME    = "--------";
const GAME_HUD_TEXT_DIGITS_SCORE = HIGHSCORE_MAX_DIGITS;
const GAME_HUD_TEXT_DIGITS_LEVEL = 2;
const GAME_HUD_TEXT_GAP          = 15;
const GAME_HUD_FONT_SIZE         = 40;

//------------------------------------------------------------------------------
class GameHud
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // iVars
        // Properties.
        let s = "";
        s = Build_Digits_String(GAME_HUD_TEXT_PREFIX_SCORE, GAME_HUD_TEXT_DIGITS_SCORE, 0);
        this.scoreText = new pw_Text(s, FONT_COMMODORE, GAME_HUD_FONT_SIZE);

        s = Build_Digits_String(GAME_HUD_TEXT_PREFIX_HI, GAME_HUD_TEXT_DIGITS_SCORE, 0);
        this.hiScoreText = new pw_Text(s, FONT_COMMODORE, GAME_HUD_FONT_SIZE);

        s = GAME_HUD_TEXT_GAME_NAME;
        this.marqueeText = new pw_Text(s, FONT_COMMODORE, GAME_HUD_FONT_SIZE);

        s = Build_Digits_String(GAME_HUD_TEXT_PREFIX_LEVEL, GAME_HUD_TEXT_DIGITS_LEVEL, 1)
        this.levelText = new pw_Text(s, FONT_COMMODORE, GAME_HUD_FONT_SIZE);

        this.score   = 0;
        this.hiscore = 0;

        //
        // Initialize.
        this.scoreText  .anchor.set(0, 0);
        this.hiScoreText.anchor.set(0, 0);
        this.marqueeText.anchor.set(1, 0);
        this.levelText  .anchor.set(1, 0);

        const screen_size = Get_Screen_Size();

        this.scoreText  .x = GAME_HUD_TEXT_GAP;
        this.hiScoreText.x = this.scoreText.x;
        this.hiScoreText.y = this.scoreText.y + this.scoreText.height - 5;

        this.marqueeText.x = screen_size.x - GAME_HUD_TEXT_GAP;
        this.levelText  .x = this.marqueeText.x;
        this.levelText  .y = this.hiScoreText.y

        Apply_TextGradientEffect(this.scoreText   , gPalette.GetScoreColor(0));
        Apply_TextGradientEffect(this.hiScoreText , gPalette.GetScoreColor(1));
        Apply_TextGradientEffect(this.marqueeText , gPalette.GetScoreColor(2));
        Apply_TextGradientEffect(this.levelText   , gPalette.GetScoreColor(3));

        this.addChild(this.scoreText  );
        this.addChild(this.hiScoreText);
        this.addChild(this.marqueeText);
        this.addChild(this.levelText  );

        this.scoreChangeTweens = [];
    } // ctor

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(!pw_Array_IsEmpty(this.scoreChangeTweens)) {
            const tween = pw_Array_GetFront(this.scoreChangeTweens);
            if(!tween.isPlaying()) {
                tween.start();
            }
            tween.update();
        }
    } // Update

    //--------------------------------------------------------------------------
    SetLevel(level)
    {
        const str = Build_Digits_String(
            GAME_HUD_TEXT_PREFIX_LEVEL,
            GAME_HUD_TEXT_DIGITS_LEVEL,
            level
        );

        this.levelText.text = str;
    } // SetLevel

    //--------------------------------------------------------------------------
    SetScore(newScore, newHiScore)
    {
        const score_change = new ScoreChange(
            this.score,   newScore,
            this.hiscore, newHiScore
        );

        this._AddNewScoreChangeTween(score_change);

        this.score   = newScore;
        this.hiscore = newHiScore;
    } // SetScore

    //--------------------------------------------------------------------------
    SetMarquee(str)
    {
        this.marqueeText.text = str.toUpperCase();
    } // SetMarquee

    //--------------------------------------------------------------------------
    _AddNewScoreChangeTween(scoreChange)
    {
        // @PERF(stdmatt): Optimization considerations.
        //  -- If the delta of the score change is too small
        //     would be best to just set it directly....
        //
        //  -- Reuse the tweens instead of creating garbage every time.
        const new_score = scoreChange.newScore;
        const old_score = scoreChange.oldScore;

        const new_hi_score = scoreChange.newHiScore;
        const old_hi_score = scoreChange.oldHiScore;

        const time  = (new_score - old_score) * 5; // @todo(stdmatt): Remove magic number...
        const tween = pw_Tween_CreateBasic(time, null)
            .onUpdate(()=>{
                const t = tween.getValue().value;
                const curr_score   = pw_Math_Int(pw_Math_Map(t, 0, 1, old_score,    new_score   ));
                const curr_hiscore = pw_Math_Int(pw_Math_Map(t, 0, 1, old_hi_score, new_hi_score));

                this.scoreText.text = Build_Digits_String(
                    GAME_HUD_TEXT_PREFIX_SCORE,
                    GAME_HUD_TEXT_DIGITS_SCORE,
                    curr_score
                );
                this.hiScoreText.text = Build_Digits_String(
                    GAME_HUD_TEXT_PREFIX_HI,
                    GAME_HUD_TEXT_DIGITS_SCORE,
                    curr_hiscore
                );
            })
            .onComplete(()=>{
                pw_Array_RemoveFront(this.scoreChangeTweens);
            });

        this.scoreChangeTweens.push(tween);
    } // _AddNewScoreChangeTween
}; // class GameHud

//----------------------------------------------------------------------------//
// ScoreChange                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class ScoreChange
{
    //--------------------------------------------------------------------------
    constructor(oldScore, newScore, oldHiScore, newHiScore)
    {
        this.oldScore   = oldScore;
        this.newScore   = newScore;
        this.oldHiScore = oldHiScore;
        this.newHiScore = newHiScore;
    } // ctor
} // ScoreChange
