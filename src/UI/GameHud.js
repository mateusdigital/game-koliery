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
        this.scoreText   = this._CreateText("Score:00000");
        this.hiScoreText = this._CreateText("Hi   :00000");
        this.marqueeText = this._CreateText("- acid -");
        this.levelText   = this._CreateText("Level 01");

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
        this.hiScoreText.y = this.scoreText.y + this.scoreText.height;

        this.marqueeText.x = screen_size.x - TEXT_GAP;
        this.levelText  .x = this.marqueeText.x;
        this.levelText  .y = this.marqueeText.y + this.marqueeText.height;

        this._ApplyMask(this.scoreText  , 5);
        this._ApplyMask(this.hiScoreText, 4);
        this._ApplyMask(this.marqueeText, 3);
        this._ApplyMask(this.levelText  , 2);

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
            fontFamily : 'Commodore 64 Rounded',
            fontSize   : 42,
            fill       : 0xffffff
        });

        let text = new PIXI.Text(str.toUpperCase(), style);
        return text;
    } // _CreateText

    //--------------------------------------------------------------------------
    _ApplyMask(text, color)
    {
        let mask = Create_Sprite("multi-color-raster");

        const MASK_COLORS_COUNT = 6;
        const MASK_COLOR_HEIGHT = (mask.height / MASK_COLORS_COUNT);
        const MASK_WIDTH_SCALE  = (text.width  / mask.width);
        const MASK_HEIGHT_SCALE = (text.height / MASK_COLOR_HEIGHT);
        const MASK_COLOR_Y      = (color * MASK_HEIGHT_SCALE * -MASK_COLOR_HEIGHT)

        mask.scale   .set(MASK_WIDTH_SCALE, MASK_HEIGHT_SCALE);
        mask.position.set(text.x, text.y + MASK_COLOR_Y);
        mask.anchor  .set(text.anchor.x, 0);
        // text.tint = color;

        mask.mask = text;
        this.addChild(mask);
    }
}; // class GameHud
