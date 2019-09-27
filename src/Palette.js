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

const PALETTE_BLOCK_COLORS_COUNT = 10;

class Palette
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.blockColors = [];
        this._InitializeBlockColors();
    } // ctor

    //--------------------------------------------------------------------------
    GetBlockColors()
    {
        return this.blockColors;
    }

    //--------------------------------------------------------------------------
    GetBlockColor(colorIndex)
    {
        return this.blockColors[colorIndex];
    }

    //--------------------------------------------------------------------------
    _InitializeBlockColors()
    {
        this.blockColors = [
            0x985c23, // brown
            0xedcf61, // yellow
            0x4dad86, // green
            0x283fb1, // dark blue
            0x8873f4, // light blue
            0xc56382, // pink
            0x812a18, // red
        ];
    }


}; // class Palette
