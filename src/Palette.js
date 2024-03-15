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

const COLORS_LENGTH = 7;

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
    _GetIndexedColor(index)
    {
        const len = SCENE_MENU_TITLE_STR.length;
        return chroma.hsl((360 / len) * index, 0.7, 0.5);
    }

    //--------------------------------------------------------------------------
    GetBlockColors()
    {
        return this.blockColors;
    } // GetBlockColors

    //--------------------------------------------------------------------------
    GetBlockColor(index)
    {
        return this._GetIndexedColor(index);
    } // GetBlockColor

    //--------------------------------------------------------------------------
    GetBlockBlinkColor(index)
    {
        return chroma("gray");
    } // GetBlockColor

    //--------------------------------------------------------------------------
    GetScoreColor(index)
    {
        return this._GetIndexedColor(index);
    } // GetScoreColor

    //--------------------------------------------------------------------------
    GetRandomScoreColor()
    {
        const index = pw_Random_Int(0, HIGHSCORE_MAX_ENTRIES);
        return this.GetScoreColor(index);
    } // GetRandomScoreColor


    //--------------------------------------------------------------------------
    _InitializeBlockColors()
    {
        this.blockColors = [];
        for(let i = 0; i < COLORS_LENGTH; ++i){
            const color = this._GetIndexedColor(i);
            this.blockColors.push(color);
        }

        // Suffle
        for (let i = this.blockColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.blockColors[i], this.blockColors[j]] = [this.blockColors[j], this.blockColors[i]];
        }

    } // _InitializeBlockColors

    //--------------------------------------------------------------------------
    GetMenuTextNormalColor()
    {
        return chroma("#3F3F3F");
    } // GetMenuTextNormalColor

    //--------------------------------------------------------------------------
    GetMenuTextSelectColor(index)
    {
        return this._GetIndexedColor(index);
    } // GetMenuTextSelectColor

    //--------------------------------------------------------------------------
    GetTitleCharColor(index)
    {
        return this._GetIndexedColor(index);
    }
}; // class Palette
