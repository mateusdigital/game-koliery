//----------------------------------------------------------------------------//
// Base_BMPText                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class pw_Base_BMPText
    extends PIXI.BitmapText
{
    //--------------------------------------------------------------------------
    constructor(str, family, size, fill = 0xFFffFF, weight = "normal", spacing = 0)
    {
        const name = pw_String_Cat(size, "px", " ", family);
        super(str.toString(), {font: name});
        this.tint = fill;
    } // ctor
}; // class Base_BMPText
