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
        this.scoreText   = this._CreateText("Score:12345");
        this.hiScoreText = this._CreateText("Hi   :67890");
        this.marqueeText = this._CreateText("AMAZIGN");
        this.levelText   = this._CreateText("Level 99");

        //
        // Initialize.
        this.scoreText  .anchor.set(0, 0);
        this.hiScoreText.anchor.set(0, 0);
        this.marqueeText.anchor.set(1, 0);
        this.levelText  .anchor.set(1, 0);

        const TEXT_GAP    = 20;
        const screen_size = Get_Screen_Size();

        this.scoreText  .x = TEXT_GAP;
        this.hiScoreText.x = this.scoreText.x;
        this.hiScoreText.y = this.scoreText.y + this.scoreText.height - 5;

        this.marqueeText.x = screen_size.x - TEXT_GAP;
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


        // var bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        // bg.tint = 0xff00FF;
        // bg.alpha = 0.2;
        // bg.x = 0;
        // bg.y = 0;
        // bg.width  = this.width;
        // bg.height = this.height
        // this.addChild(bg);
    } // ctor


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
}; // class GameHud
