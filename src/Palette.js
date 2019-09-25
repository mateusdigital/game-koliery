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
    GetBlockColor(colorIndex)
    {
        return this.blockColors[colorIndex];
    }

    //--------------------------------------------------------------------------
    _InitializeBlockColors()
    {
        for(let i = 0; i < PALETTE_BLOCK_COLORS_COUNT; ++i) {
            let color = 0xFFFFFF * Math_Random();
            this.blockColors.push(color);
        }
    }


}; // class Palette
