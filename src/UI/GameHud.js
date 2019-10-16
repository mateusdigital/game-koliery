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
const GAME_HUD_FONT_SIZE         = 31;

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
        this.scoreText = Create_Normal_Text(s, GAME_HUD_FONT_SIZE);

        s = Build_Digits_String(GAME_HUD_TEXT_PREFIX_HI, GAME_HUD_TEXT_DIGITS_SCORE, 0);
        this.hiScoreText = Create_Normal_Text(s, GAME_HUD_FONT_SIZE);

        s = GAME_HUD_TEXT_GAME_NAME;
        this.marqueeText = Create_Normal_Text(s, GAME_HUD_FONT_SIZE);

        s = Build_Digits_String(GAME_HUD_TEXT_PREFIX_LEVEL, GAME_HUD_TEXT_DIGITS_LEVEL, 1)
        this.levelText = Create_Normal_Text(s, GAME_HUD_FONT_SIZE);

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

        // @XXX
        Apply_TextGradientEffect(this.scoreText   , gPalette.GetScoreColor(0));
        Apply_TextGradientEffect(this.hiScoreText , gPalette.GetScoreColor(1));
        Apply_TextGradientEffect(this.marqueeText , gPalette.GetScoreColor(2));
        Apply_TextGradientEffect(this.levelText   , gPalette.GetScoreColor(3));

        this.addChild(this.scoreText  );
        this.addChild(this.hiScoreText);
        this.addChild(this.marqueeText);
        this.addChild(this.levelText  );
    } // ctor

    //--------------------------------------------------------------------------
    SetScore(score, hiScore)
    {
        this.scoreText  .text = Build_Digits_String(GAME_HUD_TEXT_PREFIX_SCORE, GAME_HUD_TEXT_DIGITS_SCORE, score  );
        this.hiScoreText.text = Build_Digits_String(GAME_HUD_TEXT_PREFIX_HI,    GAME_HUD_TEXT_DIGITS_SCORE, hiScore);
    }

    //--------------------------------------------------------------------------
    SetMarqueeWithMatchInfo(matchInfo)
    {
        let count = 0;
        for(let i = 0; i < matchInfo.infos.length; ++i) {
            const info = matchInfo.infos[i];
            if(info.has_match) {
                ++count;
            }
        }

        if(count == 0) {
            this._SetMarqueeText(GAME_HUD_TEXT_GAME_NAME);
        } else {
            this._SetMarqueeText(String_Cat("Match ", count));
        }
    }

    //--------------------------------------------------------------------------
    _SetMarqueeText(str)
    {
        this.marqueeText.text = str.toUpperCase();
    } // _SetMarqueeText

}; // class GameHud
