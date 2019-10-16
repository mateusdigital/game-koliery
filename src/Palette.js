//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Palette.js                                                    //
//  Project   : columns                                                       //
//  Date      : Sep 25, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Palette                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Palette
{
    //--------------------------------------------------------------------------
    constructor()
    {
        //
        // iVars
        // Properties.
        this.blockColors = [];

        //
        // Initialize.
        this._InitializeBlockColors();
    } // ctor

    //--------------------------------------------------------------------------
    GetBlockColors()
    {
        return this.blockColors;
    } // GetBlockColors

    //--------------------------------------------------------------------------
    GetBlockColor(colorIndex)
    {
        return this.blockColors[colorIndex];
    } // GetBlockColor

    //--------------------------------------------------------------------------
    GetBlockBlinkColor(colorIndex)
    {
        return chroma("gray");
    } // GetBlockColor

    //--------------------------------------------------------------------------
    GetScoreColor(colorIndex)
    {
        const colors = [
            "#8C2000",
            "#C17D00",
            "#C5B50C",
            "#009427",
            "#00B385",
            "#266DC3",
            "#7037D9",
            "#8D24C1",
            "#B0325E",
            "#8C2000",
        ];

        return chroma(colors[colorIndex]);
    }

    //--------------------------------------------------------------------------
    _InitializeBlockColors()
    {
        this.blockColors = [
            chroma("#985c23"), // brown
            chroma("#edcf61"), // yellow
            chroma("#4dad86"), // green
            chroma("#283fb1"), // dark blue
            chroma("#8873f4"), // light blue
            chroma("#c56382"), // pink
            chroma("#812a18"), // red
        ];

    } // _InitializeBlockColors
}; // class Palette
