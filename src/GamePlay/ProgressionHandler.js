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

const _p = [
    // 1 - 5
    { matchesForNextLevel: 5, pieceSpeed: 200, pieceFastSpeed: 500, scoreForMovingFast: 5, scoreForMatch: 500 },
    { matchesForNextLevel: 5, pieceSpeed: 210, pieceFastSpeed: 500, scoreForMovingFast: 5, scoreForMatch: 500 },
    { matchesForNextLevel: 5, pieceSpeed: 220, pieceFastSpeed: 500, scoreForMovingFast: 5, scoreForMatch: 500 },
    { matchesForNextLevel: 5, pieceSpeed: 230, pieceFastSpeed: 500, scoreForMovingFast: 5, scoreForMatch: 500 },
    { matchesForNextLevel: 5, pieceSpeed: 240, pieceFastSpeed: 500, scoreForMovingFast: 5, scoreForMatch: 500 },

    // 6 - 10
    { matchesForNextLevel: 8, pieceSpeed: 250, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 550 },
    { matchesForNextLevel: 8, pieceSpeed: 260, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 550 },
    { matchesForNextLevel: 8, pieceSpeed: 270, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 550 },
    { matchesForNextLevel: 8, pieceSpeed: 280, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 550 },
    { matchesForNextLevel: 8, pieceSpeed: 290, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 550 },

    // 11 - 15
    { matchesForNextLevel: 10, pieceSpeed: 290, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 600 },
    { matchesForNextLevel: 10, pieceSpeed: 300, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 600 },
    { matchesForNextLevel: 10, pieceSpeed: 310, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 600 },
    { matchesForNextLevel: 10, pieceSpeed: 320, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 600 },
    { matchesForNextLevel: 10, pieceSpeed: 330, pieceFastSpeed: 500, scoreForMovingFast: 4, scoreForMatch: 600 },

    // 16 - 20
    { matchesForNextLevel: 12, pieceSpeed: 350, pieceFastSpeed: 500, scoreForMovingFast: 2, scoreForMatch: 650 },
    { matchesForNextLevel: 12, pieceSpeed: 370, pieceFastSpeed: 500, scoreForMovingFast: 2, scoreForMatch: 650 },
    { matchesForNextLevel: 12, pieceSpeed: 390, pieceFastSpeed: 500, scoreForMovingFast: 2, scoreForMatch: 650 },
    { matchesForNextLevel: 12, pieceSpeed: 410, pieceFastSpeed: 500, scoreForMovingFast: 2, scoreForMatch: 650 },
    { matchesForNextLevel: 12, pieceSpeed: 420, pieceFastSpeed: 500, scoreForMovingFast: 2, scoreForMatch: 650 },

    // 21 - 25
    { matchesForNextLevel: 14, pieceSpeed: 420, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 700 },
    { matchesForNextLevel: 14, pieceSpeed: 430, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 700 },
    { matchesForNextLevel: 14, pieceSpeed: 440, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 700 },
    { matchesForNextLevel: 14, pieceSpeed: 450, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 700 },
    { matchesForNextLevel: 14, pieceSpeed: 460, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 700 },

    // 25 - 30
    { matchesForNextLevel: 16, pieceSpeed: 460, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 750 },
    { matchesForNextLevel: 16, pieceSpeed: 480, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 750 },
    { matchesForNextLevel: 16, pieceSpeed: 500, pieceFastSpeed: 500, scoreForMovingFast: 1, scoreForMatch: 750 },
    { matchesForNextLevel: 16, pieceSpeed: 520, pieceFastSpeed: 520, scoreForMovingFast: 1, scoreForMatch: 750 },
    { matchesForNextLevel: 16, pieceSpeed: 540, pieceFastSpeed: 540, scoreForMovingFast: 1, scoreForMatch: 750 },

    // 31 - 35
    { matchesForNextLevel: 18, pieceSpeed: 560, pieceFastSpeed: 560, scoreForMovingFast: 1, scoreForMatch: 800 },
    { matchesForNextLevel: 18, pieceSpeed: 570, pieceFastSpeed: 570, scoreForMovingFast: 1, scoreForMatch: 800 },
    { matchesForNextLevel: 18, pieceSpeed: 580, pieceFastSpeed: 580, scoreForMovingFast: 1, scoreForMatch: 800 },
    { matchesForNextLevel: 18, pieceSpeed: 590, pieceFastSpeed: 590, scoreForMovingFast: 1, scoreForMatch: 800 },
    { matchesForNextLevel: 18, pieceSpeed: 600, pieceFastSpeed: 600, scoreForMovingFast: 1, scoreForMatch: 800 },

    // 36 - 40
    { matchesForNextLevel: 20, pieceSpeed: 600, pieceFastSpeed: 600, scoreForMovingFast: 1, scoreForMatch: 850 },
    { matchesForNextLevel: 20, pieceSpeed: 610, pieceFastSpeed: 610, scoreForMovingFast: 1, scoreForMatch: 850 },
    { matchesForNextLevel: 20, pieceSpeed: 620, pieceFastSpeed: 620, scoreForMovingFast: 1, scoreForMatch: 850 },
    { matchesForNextLevel: 20, pieceSpeed: 630, pieceFastSpeed: 630, scoreForMovingFast: 1, scoreForMatch: 850 },
    { matchesForNextLevel: 20, pieceSpeed: 640, pieceFastSpeed: 640, scoreForMovingFast: 1, scoreForMatch: 850 },

    // 41 - 46
    { matchesForNextLevel: 22, pieceSpeed: 640, pieceFastSpeed: 640, scoreForMovingFast: 1, scoreForMatch: 900 },
    { matchesForNextLevel: 22, pieceSpeed: 650, pieceFastSpeed: 650, scoreForMovingFast: 1, scoreForMatch: 900 },
    { matchesForNextLevel: 22, pieceSpeed: 660, pieceFastSpeed: 660, scoreForMovingFast: 1, scoreForMatch: 900 },
    { matchesForNextLevel: 22, pieceSpeed: 670, pieceFastSpeed: 670, scoreForMovingFast: 1, scoreForMatch: 900 },
    { matchesForNextLevel: 22, pieceSpeed: 680, pieceFastSpeed: 680, scoreForMovingFast: 1, scoreForMatch: 900 },

    // 47
    { matchesForNextLevel: 99999, pieceSpeed: 700, pieceFastSpeed: 700, scoreForMovingFast: 1, scoreForMatch: 1500 },
]


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
        this.pieceSpeed         = 0;
        this.pieceFastSpeed     = 0;
        this.scoreForMovingFast = 0;

        this.matchesForNextLevel = 0;

        // Callbacks.
        this.onLevelChangeCallback = null;
        this.onScoreChangeCallback = null;
        this.onMatchCallback       = null;

        //
        // Initialize.
        this._UpdateStats();
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
        this.score += this.scoreForMatch;
        this.onScoreChangeCallback();
        --this.matchesForNextLevel;

        this._CalculateStats();
    } // AddScoreWithMatchInfo

    //--------------------------------------------------------------------------
    _CalculateStats()
    {
        if(this.matchesForNextLevel <= 0) {
            ++this.level;

            this._UpdateStats();
            this.onLevelChangeCallback();
        }
    } // _CalculateStats

    _UpdateStats()
    {

        this.pieceSpeed         = _p[this.level].pieceSpeed;
        this.pieceFastSpeed     = _p[this.level].pieceFastSpeed;
        this.scoreForMovingFast = _p[this.level].scoreForMovingFast;
        this.scoreForMatch      = _p[this.level].scoreForMatch;

        let multiplier = 1.0;

        switch(this.difficulty) {
            case 0: multiplier = 0.8; break;
            case 1: multiplier = 1.0; break;
            case 2: multiplier = 1.2; break;
        }
        this.pieceSpeed         *= multiplier;
        this.pieceFastSpeed     *= multiplier;
        this.scoreForMovingFast  = Math.trunc(this.scoreForMovingFast * multiplier);
        this.scoreForMatch       = Math.trunc(this.scoreForMatch      * multiplier);

        console.log(this.pieceSpeed);
        console.log(this.pieceFastSpeed);
        this.matchesForNextLevel =1 // _p[this.level].matchesForNextLevel;
    }

}; // class ProgressionHandler
