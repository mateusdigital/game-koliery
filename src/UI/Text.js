//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Text.js                                                       //
//  Project   : columns                                                       //
//  Date      : Oct 08, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Text                                                                       //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const TEXT_NORMAL_FONT_NAME = "Commodore 64 Rounded";
const TEXT_TITLE_FONT_NAME  = "PixelForce";
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
