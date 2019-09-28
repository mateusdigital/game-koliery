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
const GAME_HUD_TEXT_DIGITS_SCORE = 6;
const GAME_HUD_TEXT_DIGITS_LEVEL = 2;
const GAME_HUD_TEXT_GAP          = 20;

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
        s = this._BuildString(GAME_HUD_TEXT_PREFIX_SCORE, GAME_HUD_TEXT_DIGITS_SCORE, 0);
        this.scoreText = this._CreateText(s);

        s = this._BuildString(GAME_HUD_TEXT_PREFIX_HI, GAME_HUD_TEXT_DIGITS_SCORE, 0);
        this.hiScoreText = this._CreateText(s);

        s = GAME_HUD_TEXT_GAME_NAME;
        this.marqueeText = this._CreateText(s);

        s = this._BuildString(GAME_HUD_TEXT_PREFIX_LEVEL, GAME_HUD_TEXT_DIGITS_LEVEL, 1)
        this.levelText = this._CreateText(s);

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

        this._ApplyMask(this.scoreText  , 0);
        this._ApplyMask(this.hiScoreText, 1);
        this._ApplyMask(this.marqueeText, 2);
        this._ApplyMask(this.levelText  , 3);

        this.addChild(this.scoreText  );
        this.addChild(this.hiScoreText);
        this.addChild(this.marqueeText);
        this.addChild(this.levelText  );
    } // ctor

    //--------------------------------------------------------------------------
    SetScore(score, hiScore)
    {
        this.scoreText  .text = this._BuildString(GAME_HUD_TEXT_PREFIX_SCORE, GAME_HUD_TEXT_DIGITS_SCORE, score  );
        this.hiScoreText.text = this._BuildString(GAME_HUD_TEXT_PREFIX_HI,    GAME_HUD_TEXT_DIGITS_SCORE, hiScore);
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

    //--------------------------------------------------------------------------
    _CreateText(str)
    {
        const style = new PIXI.TextStyle({
            fontFamily    : "Commodore 64 Rounded",
            fontSize      : 35,
            fontWeight    : "bold",
            fill          : 0xffffff,
            letterSpacing : -5,
        });

        let text = new PIXI.Text(str.toUpperCase(), style);

        return text;
    } // _CreateText

    //--------------------------------------------------------------------------
    _ApplyMask(text, color)
    {
        let mask = Create_Sprite("mask_" + color);

        const MAGIC = 0//0.045; // This makes the mask height scale looks better...
        const MASK_COLORS_COUNT = 6;
        const MASK_COLOR_HEIGHT = (mask.height / MASK_COLORS_COUNT);
        const MASK_WIDTH_SCALE  = (text.width  / mask.width);
        const MASK_HEIGHT_SCALE = (text.height  / (mask.height)) //(text.height / MASK_COLOR_HEIGHT) + MAGIC;
        const MASK_COLOR_Y      = (color * MASK_HEIGHT_SCALE * -MASK_COLOR_HEIGHT)

        mask.scale   .set(MASK_WIDTH_SCALE, MASK_HEIGHT_SCALE);
        // mask.position.set(text.x, text.y + MASK_COLOR_Y);
        mask.position.set(text.x, text.y);
        mask.anchor  .set(text.anchor.x, 0);


        console.log(text.height, MASK_HEIGHT_SCALE);
        mask.mask = text;
        this.addChild(mask);
    }

    //--------------------------------------------------------------------------
    _BuildString(prefix, digits, value)
    {
        const value_str = value.toString();
        return String_Cat(
            prefix.toUpperCase(),
            "0".repeat(digits - value_str.length),
            value
        );
    }
}; // class GameHud
