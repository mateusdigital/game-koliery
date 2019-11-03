//----------------------------------------------------------------------------//
// Text                                                                       //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const TEXT_NORMAL_FONT_NAME = "Commodore 64 Rounded";
const TEXT_TITLE_FONT_NAME  = "Commodore 64 Rounded";//"PixelForce";
const TEXT_LETTER_SPACING_RATIO = 0 //-(1.0 / 50.0);

//------------------------------------------------------------------------------
function Create_Normal_Text(str, fontSize)
{
    const t = new Base_BMPText(
        str.toUpperCase(),
        TEXT_NORMAL_FONT_NAME,
        fontSize,
        "0xffffff",
        "bold"
    );

    t.anchor.set(0.5, 0.5);
    return t;
}

//------------------------------------------------------------------------------
function Create_Title_Text(str, fontSize, color)
{
    const t = new Base_BMPText(str, TEXT_TITLE_FONT_NAME, fontSize, color);
    return t;
}
