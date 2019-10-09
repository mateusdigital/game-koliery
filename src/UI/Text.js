//----------------------------------------------------------------------------//
// Text                                                                       //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const TEXT_FONT_NAME = "Commodore 64 Rounded";
const TEXT_LETTER_SPACING_RATIO = -(1.0 / 50.0);

//------------------------------------------------------------------------------
class Text
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(str, fontSize)
    {
        super();

        this.text = this._CreateText(str, fontSize);
        this.text.anchor.set(0.5);

        this.addChild(this.text);
    } // ctor


    //--------------------------------------------------------------------------
    _CreateText(str, fontSize)
    {
        const style = new PIXI.TextStyle({
            fontFamily    : TEXT_FONT_NAME,
            fontSize      : fontSize,
            fontWeight    : "bold",
            fill          : 0xffffff,
            letterSpacing : fontSize * TEXT_LETTER_SPACING_RATIO,
        });

        const text = new PIXI.Text(str.toUpperCase(), style);
        return text;
    } // _CreateText

    //--------------------------------------------------------------------------
    _ApplyMask(text, color)
    {
        let mask = Sprite_Create("mask_" + color);

        const MAGIC = 0//0.045; // This makes the mask height scale looks better...
        const MASK_COLORS_COUNT = 6;
        const MASK_COLOR_HEIGHT = (mask.height / MASK_COLORS_COUNT);
        const MASK_WIDTH_SCALE  = (text.width  / mask.width       );
        const MASK_HEIGHT_SCALE = (text.height / mask.height      );
        const MASK_COLOR_Y      = (color * MASK_HEIGHT_SCALE * -MASK_COLOR_HEIGHT)

        mask.scale   .set(MASK_WIDTH_SCALE, MASK_HEIGHT_SCALE);
        mask.position.set(text.x,           text.y           );
        mask.anchor  .set(text.anchor.x,    0                );

        mask.mask = text;
        this.addChild(mask);
    }

}; // class Text
