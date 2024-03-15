//----------------------------------------------------------------------------//
// Base_TTFText                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class pw_Base_TTFText
    extends PIXI.Text
{
    //--------------------------------------------------------------------------
    constructor(str, family, size, fill = 0xFFffFF, weight = "normal", spacing = 0)
    {
        const style = new PIXI.TextStyle({
            fontFamily    : family,
            fontSize      : size,
            fontWeight    : weight,
            fill          : fill,
            letterSpacing : spacing
        });

        super(str, style);
    } // ctor
}; // class Base_TTFText
