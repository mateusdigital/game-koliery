//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : ProgressionHandler.js                                         //
//  Project   : columns                                                       //
//  Date      : Nov 04, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Progression Handler                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class ProgressionHandler
{

    constructor(difficulty, level)
    {
        //
        // iVars.
        // State.
        this.difficulty = difficulty;
        this.level      = level;
        this.score      = 0;

        //
        this.pieceSpeed         = 200;
        this.scoreForMovingFast = 1;

        // Callbacks.
        this.onLevelChangeCallback = null;
        this.onScoreChangeCallback = null;
        this.onMatchCallback       = null;

        //
        // Initialize.
        this._CalculateStats();
    } // ctor

    //--------------------------------------------------------------------------
    AddScoreForMovingFast()
    {
        this.score += this.scoreForMovingFast;
        this.onScoreChangeCallback();

        this._CalculateStats();
    } // AddScoreForMovingFast

    //--------------------------------------------------------------------------
    AddScoreWithMatchInfo(matchInfo)
    {
        this.score += 500;
        this.onScoreChangeCallback();

        this._CalculateStats();
    } // AddScoreWithMatchInfo

    //--------------------------------------------------------------------------
    _CalculateStats()
    {

    } // _CalculateStats

}; // class ProgressionHandler
